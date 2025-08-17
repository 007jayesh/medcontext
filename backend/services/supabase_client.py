"""
Supabase client service for database operations and file storage
"""

import logging
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from config import settings

logger = logging.getLogger(__name__)

class SupabaseService:
    """Service class for Supabase operations"""
    
    def __init__(self):
        self.client: Optional[Client] = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Supabase client"""
        try:
            self.client = create_client(
                supabase_url=settings.supabase_url,
                supabase_key=settings.supabase_key
            )
            logger.info("Supabase client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
            raise
    
    async def upload_file(self, file_path: str, file_data: bytes, bucket: str = "documents") -> str:
        """
        Upload file to Supabase storage
        
        Args:
            file_path: Path where file should be stored
            file_data: File content as bytes
            bucket: Storage bucket name
        
        Returns:
            Public URL of uploaded file
        """
        try:
            # Upload file to storage
            result = self.client.storage.from_(bucket).upload(
                path=file_path,
                file=file_data,
                file_options={"content-type": "application/octet-stream"}
            )
            
            if result.error:
                raise Exception(f"Upload failed: {result.error}")
            
            # Get public URL
            public_url = self.client.storage.from_(bucket).get_public_url(file_path)
            
            logger.info(f"File uploaded successfully: {file_path}")
            return public_url
            
        except Exception as e:
            logger.error(f"File upload failed: {e}")
            raise
    
    async def upload_raw_document(self, file_path: str, file_data: bytes) -> str:
        """
        Upload raw document to RAW bucket
        
        Args:
            file_path: Path where file should be stored
            file_data: File content as bytes
        
        Returns:
            Public URL of uploaded file
        """
        try:
            from config import settings
            return await self.upload_file(file_path, file_data, bucket=settings.raw_documents_bucket)
        except Exception as e:
            logger.error(f"Raw document upload failed: {e}")
            raise
    
    async def save_document_metadata(self, document_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Save document metadata to database
        
        Args:
            document_data: Document metadata
        
        Returns:
            Saved document record
        """
        try:
            result = self.client.table(settings.documents_table).insert(document_data).execute()
            
            if result.data:
                logger.info(f"Document metadata saved: {document_data.get('name')}")
                return result.data[0]
            else:
                raise Exception("Failed to save document metadata")
                
        except Exception as e:
            logger.error(f"Failed to save document metadata: {e}")
            raise
    
    async def get_documents(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Retrieve documents from database
        
        Args:
            user_id: Filter by user ID (optional)
        
        Returns:
            List of document records
        """
        try:
            query = self.client.table(settings.documents_table).select("*")
            
            if user_id:
                query = query.eq("user_id", user_id)
            
            result = query.execute()
            
            return result.data or []
            
        except Exception as e:
            logger.error(f"Failed to retrieve documents: {e}")
            raise
    
    async def get_document_by_id(self, document_id: str) -> Optional[Dict[str, Any]]:
        """
        Get specific document by ID
        
        Args:
            document_id: Document ID
        
        Returns:
            Document record or None
        """
        try:
            result = self.client.table(settings.documents_table).select("*").eq("id", document_id).execute()
            
            return result.data[0] if result.data else None
            
        except Exception as e:
            logger.error(f"Failed to retrieve document {document_id}: {e}")
            raise
    
    async def delete_document(self, document_id: str) -> bool:
        """
        Delete document and its metadata
        
        Args:
            document_id: Document ID
        
        Returns:
            Success status
        """
        try:
            # Get document record first
            document = await self.get_document_by_id(document_id)
            if not document:
                return False
            
            # Delete file from storage
            if document.get("file_path"):
                self.client.storage.from_("documents").remove([document["file_path"]])
            
            # Delete metadata from database
            result = self.client.table(settings.documents_table).delete().eq("id", document_id).execute()
            
            logger.info(f"Document deleted: {document_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete document {document_id}: {e}")
            raise
    
    async def create_new_chat_session(self) -> Dict[str, Any]:
        """Create a new chat session"""
        try:
            import uuid
            
            chat_session_data = {
                "chat_id": str(uuid.uuid4()),
                "user_input": "Chat session started",
                "model_output": "Welcome! I'm ready to help you with your documents. Please upload a PDF to get started."
            }
            
            result = self.client.table(settings.chat_history_table).insert(chat_session_data).execute()
            
            if result.data:
                logger.info(f"New chat session created: {chat_session_data['chat_id']}")
                return result.data[0]
            else:
                raise Exception("Failed to create chat session")
                
        except Exception as e:
            logger.error(f"Failed to create chat session: {e}")
            raise

    async def save_chat_interaction(self, user_input: str, model_output: str, chat_id: str) -> Dict[str, Any]:
        """Save chat interaction to chat_history table with chat_id"""
        try:
            chat_data = {
                "chat_id": chat_id,
                "user_input": user_input,
                "model_output": model_output
                # created_at will be auto-generated by the database default
            }
            
            result = self.client.table(settings.chat_history_table).insert(chat_data).execute()
            
            if result.data:
                logger.info(f"Chat interaction saved successfully for chat_id: {chat_id}")
                return result.data[0]
            else:
                raise Exception("Failed to save chat interaction")
                
        except Exception as e:
            logger.error(f"Failed to save chat interaction: {e}")
            raise
    
    async def get_chat_history(self, chat_id: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        """Get chat history for a specific chat session or recent chats"""
        try:
            query = self.client.table(settings.chat_history_table).select("*")
            
            if chat_id:
                # Get messages for specific chat session
                query = query.eq("chat_id", chat_id)
            else:
                # Filter out null chat_ids when no specific chat_id provided
                query = query.not_.is_("chat_id", "null")
                
            result = query.order("created_at", desc=False).limit(limit).execute()
            
            return result.data or []
            
        except Exception as e:
            logger.error(f"Failed to retrieve chat history: {e}")
            raise

    async def get_chat_sessions(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get list of chat sessions with their latest messages"""
        try:
            # Get unique chat sessions with their latest message, filter out NULL chat_ids
            result = self.client.table(settings.chat_history_table)\
                .select("chat_id, user_input, model_output, created_at")\
                .not_.is_("chat_id", "null")\
                .order("created_at", desc=True)\
                .execute()
            
            if not result.data:
                return []
            
            # Group by chat_id and get latest message for each session
            sessions = {}
            for row in result.data:
                chat_id = row['chat_id']
                
                # Skip if chat_id is None or empty
                if not chat_id:
                    continue
                    
                if chat_id not in sessions:
                    # Get message count for this session
                    try:
                        count_result = self.client.table(settings.chat_history_table)\
                            .select("id", count="exact")\
                            .eq("chat_id", chat_id)\
                            .execute()
                        
                        message_count = count_result.count or 0
                        
                        # Create session summary
                        sessions[chat_id] = {
                            'chat_id': chat_id,
                            'title': self._generate_chat_title(row['user_input'], row['model_output']),
                            'last_message': row['created_at'],
                            'message_count': message_count,
                            'preview': row['user_input'][:50] + '...' if len(row['user_input']) > 50 else row['user_input']
                        }
                    except Exception as e:
                        logger.warning(f"Error processing session {chat_id}: {e}")
                        continue
            
            # Return sessions sorted by last message time
            session_list = list(sessions.values())
            session_list.sort(key=lambda x: x['last_message'], reverse=True)
            
            return session_list[:limit]
            
        except Exception as e:
            logger.error(f"Failed to retrieve chat sessions: {e}")
            raise
    
    def _generate_chat_title(self, user_input: str, model_output: str) -> str:
        """Generate a descriptive title for the chat session"""
        if user_input == "Chat session started":
            return "New Chat"
        
        # Create title from first meaningful user input
        words = user_input.split()[:4]  # First 4 words
        title = ' '.join(words)
        
        if len(title) > 30:
            title = title[:27] + "..."
            
        return title or "Untitled Chat"

# Global service instance
_supabase_service = None

def get_supabase_client() -> SupabaseService:
    """Get Supabase service instance (singleton)"""
    global _supabase_service
    if _supabase_service is None:
        _supabase_service = SupabaseService()
    return _supabase_service