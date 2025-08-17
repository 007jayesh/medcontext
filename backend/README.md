# Paypr MVP Backend

FastAPI backend for the Paypr MVP Chat functionality. Handles document upload, processing, storage, and chatbot interactions with Supabase integration.

## Features

- 📄 **Document Upload & Processing**: Support for PDF, Word, Excel, text, and image files
- 🗄️ **Supabase Integration**: Document storage, metadata management, and user data
- 💬 **Chat API**: AI-powered conversations with document context
- 🔍 **Full-text Search**: Search through document content
- 🔐 **Authentication Ready**: User-based access control (MVP uses mock auth)
- 📊 **Document Analytics**: Extract text, metadata, and statistics

## Quick Start

### Prerequisites

- Python 3.8+
- Supabase account and project
- OpenAI API key (optional, for enhanced processing)

### Installation

1. **Clone and setup the backend**:
   ```bash
   cd backend
   python setup.py
   ```

2. **Configure environment variables**:
   Edit `.env` file with your credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key  # Optional
   ```

3. **Setup Supabase database**:
   Execute the SQL migration files in your Supabase SQL editor:
   ```bash
   # In order:
   supabase/migrations/001_create_documents_table.sql
   supabase/migrations/002_create_chat_tables.sql
   supabase/migrations/003_create_storage_buckets.sql
   ```

4. **Start the development server**:
   ```bash
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python main.py
   ```

The API will be available at `http://localhost:8000` with interactive docs at `http://localhost:8000/docs`.

## API Endpoints

### Health & Status
- `GET /` - Health check
- `GET /health` - Detailed health status

### Authentication (MVP)
- `POST /api/auth/verify` - Verify user authentication
- `GET /api/auth/user` - Get current user info

### Documents
- `POST /api/documents/upload` - Upload and process document
- `GET /api/documents/` - List user documents
- `GET /api/documents/{id}` - Get specific document
- `DELETE /api/documents/{id}` - Delete document

### Chat
- `POST /api/chat/message` - Send chat message and get AI response
- `GET /api/chat/sessions` - Get user chat sessions
- `GET /api/chat/sessions/{id}/messages` - Get session messages

## Supported File Types

| Type | Extensions | Processing |
|------|------------|------------|
| PDF | `.pdf` | Text extraction, metadata |
| Word | `.doc`, `.docx` | Text extraction, metadata |
| Excel | `.xls`, `.xlsx` | Data extraction, sheet info |
| Text | `.txt` | Content reading |
| CSV | `.csv` | Data parsing, structure analysis |
| Images | `.jpg`, `.png` | Metadata extraction (OCR ready) |

## Database Schema

### Documents Table
```sql
- id (UUID, Primary Key)
- user_id (TEXT)
- name (TEXT)
- size (BIGINT)
- mime_type (TEXT)
- file_path (TEXT)
- upload_url (TEXT)
- status (TEXT) - uploading, processing, ready, error
- extracted_text (TEXT)
- metadata (JSONB)
- word_count (INTEGER)
- char_count (INTEGER)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Chat Sessions Table
```sql
- id (UUID, Primary Key)
- user_id (TEXT)
- title (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Chat Messages Table
```sql
- id (UUID, Primary Key)
- session_id (UUID, Foreign Key)
- user_id (TEXT)
- content (TEXT)
- sender (TEXT) - user, assistant
- data_source (TEXT) - database, uploaded, both
- document_context (TEXT)
- metadata (JSONB)
- created_at (TIMESTAMPTZ)
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_KEY` | Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes |
| `OPENAI_API_KEY` | OpenAI API key for enhanced processing | No |
| `MAX_FILE_SIZE` | Maximum file size in bytes (default: 50MB) | No |
| `UPLOAD_DIRECTORY` | Temporary upload directory | No |

### File Upload Limits

- **Maximum file size**: 50MB (configurable)
- **Allowed types**: PDF, Word, Excel, text, CSV, images
- **Storage**: Supabase Storage with automatic cleanup

## Development

### Project Structure
```
backend/
├── main.py                 # FastAPI application entry point
├── config.py              # Application configuration
├── requirements.txt       # Python dependencies
├── routers/               # API route handlers
│   ├── auth.py           # Authentication endpoints
│   ├── documents.py      # Document management
│   └── chat.py           # Chat functionality
├── services/              # Business logic services
│   ├── supabase_client.py # Supabase integration
│   └── document_processor.py # Document processing
└── supabase/
    └── migrations/        # Database schema migrations
```

### Adding New Document Types

1. Add MIME type to `config.py` allowed types
2. Implement processor method in `document_processor.py`
3. Add to supported types dictionary
4. Update file validation in upload endpoint

### Testing

```bash
# Install development dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Test specific endpoint
curl -X POST "http://localhost:8000/api/documents/upload" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@test.pdf"
```

## Production Deployment

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Setup
- Set `ENVIRONMENT=production`
- Configure proper authentication
- Set up monitoring and logging
- Configure CORS for your frontend domain

## Security Considerations

- 🔐 **Row Level Security**: Enabled on all tables
- 🗂️ **File Access Control**: Users can only access their own files
- ✅ **File Validation**: Type and size validation
- 🧹 **Automatic Cleanup**: Storage cleanup when documents are deleted
- 🔑 **Service Role**: Admin operations use service role key

## Monitoring

The backend includes health check endpoints and logging:

- **Health check**: `GET /health`
- **Logging**: Structured logging with configurable levels
- **Error handling**: Comprehensive error responses
- **Metrics ready**: Ready for monitoring integration

## Troubleshooting

### Common Issues

1. **Supabase connection failed**:
   - Check your Supabase URL and keys
   - Ensure your Supabase project is active

2. **File upload fails**:
   - Check file size limits
   - Verify file type is supported
   - Ensure storage bucket exists

3. **Database migrations fail**:
   - Run migrations in order
   - Check for syntax errors
   - Verify permissions

### Logs

Check application logs for detailed error information:
```bash
tail -f backend.log  # If logging to file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

This project is part of the Paypr MVP and is proprietary software.