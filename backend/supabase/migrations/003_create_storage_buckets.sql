-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    false,  -- private bucket
    52428800,  -- 50MB limit
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv',
        'image/jpeg',
        'image/png'
    ]
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the documents bucket

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload to their own folder" ON storage.objects
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to view/download their own files
CREATE POLICY "Users can view their own files" ON storage.objects
    FOR SELECT 
    USING (
        bucket_id = 'documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files" ON storage.objects
    FOR DELETE 
    USING (
        bucket_id = 'documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow service role to access all files (for admin operations)
CREATE POLICY "Service role can access all documents" ON storage.objects
    FOR ALL 
    USING (bucket_id = 'documents' AND auth.role() = 'service_role');

-- Create function to automatically clean up storage when document record is deleted
CREATE OR REPLACE FUNCTION delete_storage_object_on_document_delete()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM storage.objects 
    WHERE bucket_id = 'documents' AND name = OLD.file_path;
    RETURN OLD;
END;
$$ language 'plpgsql';

-- Create trigger to delete storage object when document is deleted
CREATE TRIGGER delete_storage_on_document_delete
    AFTER DELETE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION delete_storage_object_on_document_delete();