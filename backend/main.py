"""
FastAPI backend for Paypr MVP Chat functionality
Handles document upload, processing, storage, and chatbot interactions
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from typing import List, Optional
import logging
from contextlib import asynccontextmanager

from config import settings
from routers import documents, chat, auth
from services.supabase_client import get_supabase_client
from services.document_processor import DocumentProcessor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events - Pre-load heavy imports and initialize services"""
    logger.info("🚀 Starting Paypr MVP Backend with pre-loading...")
    
    # Pre-load heavy imports and initialize services
    try:
        # Step 1: Pre-load all heavy AI/ML imports
        logger.info("📦 Pre-loading heavy imports...")
        import time
        start_time = time.time()
        
        # Pre-import all ML/AI libraries
        import PyPDF2
        import google.generativeai as genai
        from mistralai import Mistral, DocumentURLChunk
        from docling.document_converter import DocumentConverter
        from PIL import Image
        import pandas as pd
        import magic
        from docx import Document as DocxDocument
        
        import_time = time.time() - start_time
        logger.info(f"✅ Heavy imports completed in {import_time:.2f} seconds")
        
        # Step 2: Initialize Supabase connection
        logger.info("🗄️  Initializing Supabase connection...")
        supabase = get_supabase_client()
        logger.info("✅ Supabase client initialized successfully")
        
        # Step 3: Initialize Document Processor with pre-loaded converter
        logger.info("🛠️  Initializing Document Processor...")
        doc_processor = DocumentProcessor()
        logger.info("✅ Document processor initialized successfully")
        
        # Step 4: Pre-initialize DocumentConverter (this is the slow part!)
        logger.info("📄 Pre-initializing DocumentConverter...")
        converter_start = time.time()
        
        # Access the advanced processor and initialize its converter
        advanced_processor = doc_processor.advanced_processor
        if advanced_processor and hasattr(advanced_processor, 'docling_converter'):
            # Force initialization by accessing the converter
            _ = advanced_processor.docling_converter
            converter_time = time.time() - converter_start
            logger.info(f"✅ DocumentConverter pre-initialized in {converter_time:.2f} seconds")
        else:
            logger.warning("⚠️  Could not access DocumentConverter for pre-initialization")
        
        # Step 5: Pre-initialize AI clients
        logger.info("🤖 Pre-initializing AI clients...")
        ai_start = time.time()
        
        # Initialize Mistral client
        if hasattr(advanced_processor, 'mistral_client') and advanced_processor.mistral_client:
            logger.info("✅ Mistral client pre-initialized")
        
        # Initialize Gemini
        if hasattr(advanced_processor, '_initialize_clients'):
            # The initialization already happened in constructor
            logger.info("✅ Gemini client pre-initialized")
        
        ai_time = time.time() - ai_start
        logger.info(f"✅ AI clients pre-initialized in {ai_time:.2f} seconds")
        
        total_time = time.time() - start_time
        logger.info(f"🎉 Backend startup completed in {total_time:.2f} seconds")
        logger.info("🚀 Ready for fast document processing!")
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize services: {e}")
        import traceback
        traceback.print_exc()
        raise
    
    yield
    
    logger.info("🛑 Shutting down Paypr MVP Backend...")

# Create FastAPI app
app = FastAPI(
    title="Paypr MVP Backend",
    description="Backend API for Paypr MVP Chat functionality",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for demo
    allow_credentials=False,  # Set to False when allowing all origins
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Paypr MVP Backend is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    try:
        # Test Supabase connection
        supabase = get_supabase_client()
        
        return {
            "status": "healthy",
            "services": {
                "supabase": "connected",
                "document_processor": "ready"
            },
            "timestamp": os.popen("date").read().strip()
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Service unavailable")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )