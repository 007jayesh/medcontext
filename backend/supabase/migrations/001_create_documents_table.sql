-- Create documents table for storing document metadata
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    upload_url TEXT,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('uploading', 'processing', 'ready', 'error')),
    extracted_text TEXT,
    metadata JSONB DEFAULT '{}',
    word_count INTEGER DEFAULT 0,
    char_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_mime_type ON documents(mime_type);

-- Create full-text search index on extracted text
CREATE INDEX IF NOT EXISTS idx_documents_extracted_text_fts ON documents USING gin(to_tsvector('english', extracted_text));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only access their own documents
CREATE POLICY "Users can only access their own documents" ON documents
    FOR ALL USING (auth.uid()::text = user_id);

-- Create policy for service role to access all documents (for admin operations)
CREATE POLICY "Service role can access all documents" ON documents
    FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT ALL ON documents TO authenticated;
GRANT ALL ON documents TO service_role;