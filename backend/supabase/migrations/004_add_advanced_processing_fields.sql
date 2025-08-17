-- Add new fields to documents table for advanced AI processing
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS processing_method TEXT DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS consolidated_markdown TEXT,
ADD COLUMN IF NOT EXISTS understanding_response TEXT,
ADD COLUMN IF NOT EXISTS docling_markdown TEXT,
ADD COLUMN IF NOT EXISTS mistral_markdown TEXT;

-- Create index for processing method
CREATE INDEX IF NOT EXISTS idx_documents_processing_method ON documents(processing_method);

-- Create index for faster search on consolidated markdown
CREATE INDEX IF NOT EXISTS idx_documents_consolidated_markdown_fts 
ON documents USING gin(to_tsvector('english', consolidated_markdown));

-- Update existing documents to have basic processing method
UPDATE documents 
SET processing_method = 'basic' 
WHERE processing_method IS NULL;

-- Create function to automatically update search vectors when content changes
CREATE OR REPLACE FUNCTION update_document_search_vectors()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the main extracted_text search vector if consolidated_markdown exists
    IF NEW.consolidated_markdown IS NOT NULL AND LENGTH(NEW.consolidated_markdown) > 0 THEN
        NEW.extracted_text = NEW.consolidated_markdown;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update search vectors
DROP TRIGGER IF EXISTS update_document_search_vectors_trigger ON documents;
CREATE TRIGGER update_document_search_vectors_trigger
    BEFORE INSERT OR UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_document_search_vectors();

-- Create view for advanced processed documents
CREATE OR REPLACE VIEW advanced_processed_documents AS
SELECT 
    id,
    user_id,
    name,
    size,
    mime_type,
    status,
    processing_method,
    consolidated_markdown,
    understanding_response,
    word_count,
    char_count,
    created_at,
    updated_at
FROM documents
WHERE processing_method = 'advanced_ai_pipeline'
AND status = 'ready'
AND consolidated_markdown IS NOT NULL;

-- Grant access to the view
GRANT SELECT ON advanced_processed_documents TO authenticated;
GRANT SELECT ON advanced_processed_documents TO service_role;