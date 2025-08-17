"""
Configuration settings for the FastAPI backend
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    """Application settings"""
    
    # Supabase configuration
    supabase_url: str = Field(..., description="Supabase project URL")
    supabase_key: str = Field(..., description="Supabase anon/service key")
    supabase_service_key: Optional[str] = Field(None, description="Supabase service role key")
    
    # AI API configurations
    mistral_api_key: Optional[str] = Field(None, description="Mistral AI API key")
    google_api_key: Optional[str] = Field(None, description="Google Gemini API key")
    gemini_model_name: str = Field("gemini-2.5-flash", description="Gemini model name")
    
    # File upload settings
    max_file_size: int = Field(50 * 1024 * 1024, description="Maximum file size in bytes (50MB)")
    allowed_file_types: list = Field(
        default=[
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain",
            "text/csv",
            "image/jpeg",
            "image/png"
        ],
        description="Allowed MIME types for file uploads"
    )
    
    # Storage configuration
    upload_directory: str = Field("uploads", description="Directory for temporary file storage")
    raw_documents_bucket: str = Field("RAW", description="Supabase bucket for raw documents")
    
    # Database settings
    documents_table: str = Field("documents", description="Supabase table for document metadata")
    chat_history_table: str = Field("chat_history", description="Supabase table for chat history")
    
    # Environment
    environment: str = Field("development", description="Environment (development/production)")
    debug: bool = Field(True, description="Debug mode")
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()