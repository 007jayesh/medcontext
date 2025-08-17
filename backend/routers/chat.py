"""
Chat router for chatbot interactions and conversation management
"""

import uuid
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from enum import Enum

from services.supabase_client import get_supabase_client
from services.advanced_document_processor import AdvancedDocumentProcessor

logger = logging.getLogger(__name__)

router = APIRouter()

class DataSource(str, Enum):
    """Data source options for chat"""
    DATABASE = "database"
    UPLOADED = "uploaded"
    BOTH = "both"

class ChatMessage(BaseModel):
    """Chat message model"""
    content: str
    chat_id: Optional[str] = None
    data_source: DataSource = DataSource.DATABASE

class ChatResponse(BaseModel):
    """Chat response model"""
    id: int
    chat_id: str
    user_input: str
    model_output: str
    created_at: str

class ChatSession(BaseModel):
    """Chat session model"""
    chat_id: str
    title: str
    last_message: str
    message_count: int
    preview: str

class ChatHistoryResponse(BaseModel):
    """Chat history response model"""
    history: List[ChatResponse]
    total: int

class ChatSessionsResponse(BaseModel):
    """Chat sessions response model"""
    sessions: List[ChatSession]
    total: int

class NewChatResponse(BaseModel):
    """New chat session response model"""
    chat_id: str
    message: str

@router.post("/new", response_model=NewChatResponse)
async def create_new_chat():
    """
    Create a new chat session
    
    Returns:
        New chat session ID and welcome message
    """
    try:
        supabase = get_supabase_client()
        
        # Create new chat session
        new_session = await supabase.create_new_chat_session()
        
        logger.info(f"New chat session created: {new_session['chat_id']}")
        
        return NewChatResponse(
            chat_id=new_session["chat_id"],
            message="New chat session started. Ready to help with your documents!"
        )
        
    except Exception as e:
        logger.error(f"Failed to create new chat session: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to create new chat session"
        )

@router.post("/message", response_model=ChatResponse)
async def send_message(
    message: ChatMessage,
    user_id: str = "demo_user"  # For demo purposes
):
    """
    Send a chat message and get AI response
    
    Args:
        message: Chat message content, chat_id, and data source
        user_id: User identifier
    
    Returns:
        AI response and saves interaction to chat_history
    """
    try:
        supabase = get_supabase_client()
        advanced_processor = AdvancedDocumentProcessor()
        
        # Validate chat_id
        if not message.chat_id:
            raise HTTPException(
                status_code=400,
                detail="chat_id is required. Create a new chat session first."
            )
        
        logger.info(f"Processing message for chat {message.chat_id}: {message.content[:50]}...")
        
        # Get chat history for context
        chat_history = await supabase.get_chat_history(chat_id=message.chat_id, limit=10)
        
        # Generate AI response based on data source
        if message.data_source == DataSource.UPLOADED or message.data_source == DataSource.BOTH:
            # Try to get documents from database first
            try:
                db_documents = await supabase.get_documents(user_id)
                
                # Find a document with consolidated_markdown (text-based PDF)
                text_document = None
                for doc in db_documents:
                    if doc.get("consolidated_markdown"):
                        text_document = doc
                        break
                
                if text_document:
                    consolidated_markdown = text_document["consolidated_markdown"]
                    filename = text_document["name"]
                    
                    logger.info(f"Found database document: {filename}, content length: {len(consolidated_markdown)}")
                    
                    # Convert chat history to the format expected by chat_with_document
                    formatted_history = []
                    for msg in chat_history:
                        if msg.get('user_input') != 'Chat session started':
                            formatted_history.append({
                                'sender': 'user',
                                'content': msg.get('user_input', '')
                            })
                            formatted_history.append({
                                'sender': 'assistant', 
                                'content': msg.get('model_output', '')
                            })
                    
                    # Generate response using document content with history
                    ai_response_content = await advanced_processor.chat_with_document(
                        user_message=message.content,
                        consolidated_markdown=consolidated_markdown,
                        filename=filename,
                        chat_history=formatted_history
                    )
                    
                    logger.info("Generated AI response using database document content")
                else:
                    logger.info("No text-based documents with consolidated_markdown found in database")
                    ai_response_content = "Please upload a text-based PDF document first to enable AI-powered document chat. Image-based PDFs don't support detailed text queries."
                    
            except Exception as db_error:
                logger.warning(f"Database document retrieval failed: {db_error}")
                
                # Fallback to demo document content
                from routers.documents import _demo_document_content
                
                if _demo_document_content and _demo_document_content.get("consolidated_markdown"):
                    consolidated_markdown = _demo_document_content["consolidated_markdown"]
                    filename = _demo_document_content["filename"]
                    processing_method = _demo_document_content.get("processing_method", "unknown")
                    
                    logger.info(f"Fallback to demo document: {filename}, content length: {len(consolidated_markdown)}, method: {processing_method}")
                    
                    # Convert chat history to the format expected by chat_with_document
                    formatted_history = []
                    for msg in chat_history:
                        if msg.get('user_input') != 'Chat session started':
                            formatted_history.append({
                                'sender': 'user',
                                'content': msg.get('user_input', '')
                            })
                            formatted_history.append({
                                'sender': 'assistant', 
                                'content': msg.get('model_output', '')
                            })
                    
                    # Generate response using document content with history
                    ai_response_content = await advanced_processor.chat_with_document(
                        user_message=message.content,
                        consolidated_markdown=consolidated_markdown,
                        filename=filename,
                        chat_history=formatted_history
                    )
                    
                    logger.info("Generated AI response using fallback document content")
                else:
                    logger.warning("No document content found in database or fallback")
                    ai_response_content = "Please upload a PDF document first to enable AI-powered document chat."
        else:
            # Database or fallback response
            ai_response_content = f"I'm ready to help! I can chat with your uploaded documents once you upload a PDF file. Your question: '{message.content}' will be answered using the document content."
        
        # Save the chat interaction to chat_history table with chat_id
        saved_interaction = await supabase.save_chat_interaction(
            user_input=message.content,
            model_output=ai_response_content,
            chat_id=message.chat_id
        )
        
        logger.info("Chat interaction saved successfully")
        
        return ChatResponse(
            id=saved_interaction["id"],
            chat_id=saved_interaction["chat_id"],
            user_input=saved_interaction["user_input"],
            model_output=saved_interaction["model_output"],
            created_at=saved_interaction["created_at"]
        )
        
    except Exception as e:
        logger.error(f"Chat message processing failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process chat message: {str(e)}"
        )

@router.get("/sessions", response_model=ChatSessionsResponse)
async def get_chat_sessions():
    """
    Get list of chat sessions for sidebar
    
    Returns:
        List of chat sessions with metadata
    """
    try:
        supabase = get_supabase_client()
        
        # Get chat sessions
        sessions_data = await supabase.get_chat_sessions(limit=20)
        
        # Convert to response format
        chat_sessions = [
            ChatSession(
                chat_id=session["chat_id"],
                title=session["title"],
                last_message=session["last_message"],
                message_count=session["message_count"],
                preview=session["preview"]
            )
            for session in sessions_data
        ]
        
        return ChatSessionsResponse(
            sessions=chat_sessions,
            total=len(chat_sessions)
        )
        
    except Exception as e:
        logger.error(f"Failed to get chat sessions: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve chat sessions"
        )

@router.get("/history/{chat_id}", response_model=ChatHistoryResponse)
async def get_chat_history(
    chat_id: str,
    limit: int = 50
):
    """
    Get chat history for a specific chat session
    
    Args:
        chat_id: Chat session ID
        limit: Maximum number of chat interactions to return
    
    Returns:
        List of chat interactions for the session
    """
    try:
        supabase = get_supabase_client()
        
        # Get chat history for specific session
        history_data = await supabase.get_chat_history(chat_id=chat_id, limit=limit)
        
        # Convert to response format
        chat_responses = [
            ChatResponse(
                id=item["id"],
                chat_id=item["chat_id"],
                user_input=item["user_input"],
                model_output=item["model_output"],
                created_at=item["created_at"]
            )
            for item in history_data
        ]
        
        return ChatHistoryResponse(
            history=chat_responses,
            total=len(chat_responses)
        )
        
    except Exception as e:
        logger.error(f"Failed to get chat history for session {chat_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve chat history"
        )

# Simple demo implementation - removed complex session management
# The chat_history table directly stores user input and model output