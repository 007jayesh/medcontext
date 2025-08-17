"""
Documents router for file upload, processing, and management
"""

import os
import uuid
import logging
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from config import settings
from services.supabase_client import get_supabase_client
from services.document_processor import DocumentProcessor

# Global variable for demo document storage
_demo_document_content = None

logger = logging.getLogger(__name__)

router = APIRouter()

class DocumentResponse(BaseModel):
    """Document response model"""
    id: str
    name: str
    size: int
    type: str
    status: str
    upload_url: Optional[str] = None
    extracted_text: Optional[str] = None
    metadata: Optional[dict] = None
    created_at: str

class DocumentListResponse(BaseModel):
    """Document list response model"""
    documents: List[DocumentResponse]
    total: int

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = "demo_user"  # For demo purposes
):
    """
    Upload and process a document
    
    Args:
        file: Uploaded file
        user_id: User identifier
    
    Returns:
        Document metadata and processing results
    """
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Read file content
        file_content = await file.read()
        
        # Validate file size
        if len(file_content) > settings.max_file_size:
            raise HTTPException(
                status_code=413, 
                detail=f"File too large. Maximum size: {settings.max_file_size} bytes"
            )
        
        # Detect and validate file type
        doc_processor = DocumentProcessor()
        mime_type = doc_processor.get_file_type(file_content, file.filename)
        
        if mime_type not in settings.allowed_file_types:
            raise HTTPException(
                status_code=415,
                detail=f"File type not supported: {mime_type}"
            )
        
        # Generate unique document ID and file path
        document_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        raw_file_path = f"raw_documents/{user_id}/{timestamp}_{document_id}_{file.filename}"
        
        # For demo: Skip actual storage upload, just simulate
        raw_upload_url = f"demo://uploaded/{file.filename}"
        logger.info(f"Demo mode: Simulated upload of {file.filename}")
        
        # Process document content
        processing_result = await doc_processor.process_document(
            file_content, file.filename, mime_type
        )
        
        # Prepare document data for database storage
        saved_document = {
            "id": document_id,
            "user_id": user_id,
            "name": file.filename,
            "size": len(file_content),
            "mime_type": mime_type,
            "file_path": raw_file_path,
            "upload_url": raw_upload_url,
            "status": "ready" if processing_result["processing_status"] == "success" else "error",
            "extracted_text": processing_result.get("extracted_text", ""),
            "metadata": processing_result.get("metadata", {}),
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Store consolidated_markdown for text-based PDFs only
        if (processing_result.get("processing_method") == "advanced_ai_pipeline" and 
            processing_result.get("consolidated_markdown")):
            saved_document["consolidated_markdown"] = processing_result.get("consolidated_markdown")
            logger.info(f"Storing consolidated_markdown for text-based PDF: {file.filename}")
        
        # Save to database using Supabase
        try:
            supabase = get_supabase_client()
            db_document = await supabase.save_document_metadata(saved_document)
            logger.info(f"Document saved to database: {file.filename}")
            
            # Log specifically if consolidated_markdown was saved
            if saved_document.get("consolidated_markdown"):
                logger.info(f"✅ consolidated_markdown saved to database for: {file.filename}")
                logger.info(f"   Content length: {len(saved_document['consolidated_markdown'])} characters")
            
            saved_document = db_document
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Failed to save document to database: {e}")
            
            # Check if it's a table missing error
            if "Could not find the table" in error_msg or "PGRST205" in error_msg:
                logger.error("❌ DATABASE TABLES NOT CREATED YET!")
                logger.error("🔧 Please run the Supabase migrations first:")
                logger.error("   1. Go to your Supabase dashboard")
                logger.error("   2. Navigate to SQL Editor") 
                logger.error("   3. Run migrations in /backend/supabase/migrations/ in order")
                logger.error("   4. Start with 001_create_documents_table.sql")
                logger.error("   5. Then run 004_add_advanced_processing_fields.sql for consolidated_markdown")
            
            # Fallback to in-memory storage for demo
            logger.info(f"Fallback: Document stored in memory")
            
            # Store consolidated markdown in a global variable for chat use (fallback)
            if processing_result.get("consolidated_markdown"):
                global _demo_document_content
                _demo_document_content = {
                    "consolidated_markdown": processing_result.get("consolidated_markdown"),
                    "filename": file.filename,
                    "document_id": document_id,
                    "processing_method": processing_result.get("processing_method", "unknown")
                }
                logger.info(f"📝 consolidated_markdown stored in memory as fallback")
        
        logger.info(f"Document uploaded and processed successfully: {file.filename}")
        
        return DocumentResponse(
            id=document_id,
            name=file.filename,
            size=len(file_content),
            type=mime_type,
            status=saved_document["status"],
            upload_url=raw_upload_url,
            extracted_text=processing_result.get("extracted_text"),
            metadata=processing_result.get("metadata"),
            created_at=saved_document["created_at"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Document upload failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Document upload failed: {str(e)}"
        )

@router.get("/", response_model=DocumentListResponse)
async def list_documents(
    user_id: str = "demo_user",  # For demo purposes
    limit: int = 50,
    offset: int = 0
):
    """
    List user documents from database with fallback to in-memory storage
    """
    try:
        # Try to get documents from database first
        try:
            supabase = get_supabase_client()
            db_documents = await supabase.get_documents(user_id)
            
            documents = []
            for doc in db_documents:
                documents.append(DocumentResponse(
                    id=doc["id"],
                    name=doc["name"],
                    size=doc["size"],
                    type=doc["mime_type"],
                    status=doc["status"],
                    upload_url=doc.get("upload_url", ""),
                    extracted_text=doc.get("extracted_text", "")[:200] + "..." if doc.get("extracted_text") else "",
                    metadata=doc.get("metadata", {}),
                    created_at=doc["created_at"]
                ))
            
            logger.info(f"Retrieved {len(documents)} documents from database")
            
            return DocumentListResponse(
                documents=documents,
                total=len(documents)
            )
            
        except Exception as db_error:
            logger.warning(f"Database retrieval failed: {db_error}")
            
            # Fallback to in-memory storage for demo
            documents = []
            if _demo_document_content:
                documents = [DocumentResponse(
                    id=_demo_document_content["document_id"],
                    name=_demo_document_content["filename"],
                    size=1000000,  # Mock size
                    type="application/pdf",
                    status="ready",
                    upload_url="demo://uploaded",
                    extracted_text=_demo_document_content["consolidated_markdown"][:200] + "...",
                    metadata={"processing_method": "advanced_ai_pipeline"},
                    created_at=datetime.utcnow().isoformat()
                )]
            
            logger.info(f"Retrieved {len(documents)} documents from fallback storage")
            
            return DocumentListResponse(
                documents=documents,
                total=len(documents)
            )
        
    except Exception as e:
        logger.error(f"Failed to list documents: {e}")
        return DocumentListResponse(documents=[], total=0)

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: str,
    user_id: str = "demo_user"  # For demo purposes
):
    """
    Get specific document by ID
    
    Args:
        document_id: Document identifier
        user_id: User identifier
    
    Returns:
        Document details
    """
    try:
        supabase = get_supabase_client()
        document = await supabase.get_document_by_id(document_id)
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Verify user ownership
        if document["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        return DocumentResponse(
            id=document["id"],
            name=document["name"],
            size=document["size"],
            type=document["mime_type"],
            status=document["status"],
            upload_url=document.get("upload_url"),
            extracted_text=document.get("extracted_text"),
            metadata=document.get("metadata"),
            created_at=document["created_at"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get document {document_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve document"
        )

@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    user_id: str = "demo_user"  # For demo purposes
):
    """
    Delete a document from database with fallback to in-memory storage
    
    Args:
        document_id: Document identifier
        user_id: User identifier
    
    Returns:
        Success message
    """
    try:
        # Try to delete from database first
        try:
            supabase = get_supabase_client()
            
            # Verify document exists and user ownership
            document = await supabase.get_document_by_id(document_id)
            if not document:
                raise HTTPException(status_code=404, detail="Document not found")
            
            if document["user_id"] != user_id:
                raise HTTPException(status_code=403, detail="Access denied")
            
            # Delete document from database
            success = await supabase.delete_document(document_id)
            
            if not success:
                raise HTTPException(status_code=500, detail="Failed to delete document from database")
            
            logger.info(f"Document deleted from database: {document_id}")
            
            return {"message": "Document deleted successfully"}
            
        except HTTPException:
            raise
        except Exception as db_error:
            logger.warning(f"Database deletion failed: {db_error}")
            
            # Fallback to in-memory deletion for demo
            global _demo_document_content
            
            # Check if document exists in memory
            if not _demo_document_content or _demo_document_content.get("document_id") != document_id:
                raise HTTPException(status_code=404, detail="Document not found")
            
            # Clear in-memory document storage
            _demo_document_content = None
            
            logger.info(f"Fallback: Document deleted from memory: {document_id}")
            
            return {"message": "Document deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete document {document_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to delete document"
        )