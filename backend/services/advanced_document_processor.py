"""
Advanced document processing service using Docling, Mistral OCR, and Gemini
"""

import os
import json
import logging
import tempfile
import asyncio
from pathlib import Path
from typing import Dict, Any, Optional, Tuple
import aiofiles
from mistralai import Mistral, DocumentURLChunk
from docling.document_converter import DocumentConverter
import google.generativeai as genai

from config import settings

logger = logging.getLogger(__name__)

class AdvancedDocumentProcessor:
    """Advanced document processor with AI integration"""
    
    def __init__(self):
        self.mistral_client = None
        self.docling_converter = None
        self._initialize_clients()
    
    def _initialize_clients(self):
        """Initialize AI clients"""
        try:
            # Initialize Mistral client
            if settings.mistral_api_key:
                self.mistral_client = Mistral(api_key=settings.mistral_api_key)
                logger.info("Mistral client initialized successfully")
            else:
                logger.warning("Mistral API key not provided")
            
            # Initialize Docling converter
            self.docling_converter = DocumentConverter()
            logger.info("Docling converter initialized successfully")
            
            # Initialize Gemini
            if settings.google_api_key:
                genai.configure(api_key=settings.google_api_key)
                logger.info("Gemini client initialized successfully")
            else:
                logger.warning("Google API key not provided")
                
        except Exception as e:
            logger.error(f"Failed to initialize AI clients: {e}")
            raise
    
    async def process_pdf_document(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """
        Process PDF document using either:
        1. Direct Gemini processing for image-heavy PDFs (detected early)
        2. Docling + Mistral OCR + Gemini pipeline for text-heavy PDFs
        
        Args:
            file_content: PDF file content as bytes
            filename: Original filename
        
        Returns:
            Dictionary containing processed document data
        """
        try:
            logger.info(f"Starting advanced PDF processing for: {filename}")
            
            # Create temporary file for processing
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
                temp_file.write(file_content)
                temp_file_path = Path(temp_file.name)
            
            try:
                # STEP 1: Early PDF type detection
                is_image_pdf = await self._detect_image_pdf_early(temp_file_path)
                
                if is_image_pdf:
                    logger.info(f"Early detection: {filename} is image-heavy. Using direct Gemini processing.")
                    
                    # Use Gemini directly for image-based PDF processing
                    gemini_response = await self._process_image_pdf_with_gemini(file_content, filename)
                    
                    return {
                        'processing_status': 'success',
                        'filename': filename,
                        'processing_method': 'gemini_image_direct',
                        'consolidated_markdown': gemini_response,
                        'understanding_response': "Document processed and summarized using Gemini image analysis.",
                        'extracted_text': gemini_response,
                        'metadata': {
                            'processing_method': 'gemini_image_direct',
                            'is_image_pdf': True,
                            'gemini_model': settings.gemini_model_name,
                            'early_detection': True
                        },
                        'word_count': len(gemini_response.split()),
                        'char_count': len(gemini_response)
                    }
                else:
                    logger.info(f"Early detection: {filename} is text-heavy. Using advanced AI pipeline.")
                    
                    # Step 2: Extract markdown using Docling
                    docling_markdown = await self._extract_markdown_with_docling(temp_file_path)
                    logger.info(f"Docling extraction completed: {len(docling_markdown)} characters")
                    
                    # Step 3: Extract markdown using Mistral OCR
                    mistral_markdown = await self._extract_markdown_with_mistral(temp_file_path)
                    logger.info(f"Mistral OCR extraction completed: {len(mistral_markdown)} characters")
                    
                    # Step 4: Consolidate markdowns using Gemini (Request 1)
                    consolidated_markdown = await self._consolidate_markdowns_with_gemini(
                        docling_markdown, mistral_markdown, filename
                    )
                    logger.info(f"Markdown consolidation completed: {len(consolidated_markdown)} characters")
                    
                    # Step 5: Process document understanding with Gemini (Request 2)
                    understanding_response = await self._process_document_understanding_with_gemini(
                        consolidated_markdown, filename
                    )
                    logger.info("Document understanding processing completed")
                    
                    return {
                        'processing_status': 'success',
                        'filename': filename,
                        'processing_method': 'advanced_ai_pipeline',
                        'docling_markdown': docling_markdown,
                        'mistral_markdown': mistral_markdown,
                        'consolidated_markdown': consolidated_markdown,
                        'understanding_response': understanding_response,
                        'extracted_text': consolidated_markdown,  # For compatibility
                        'metadata': {
                            'processing_method': 'advanced_ai_pipeline',
                            'docling_length': len(docling_markdown),
                            'mistral_length': len(mistral_markdown),
                            'consolidated_length': len(consolidated_markdown),
                            'gemini_model': settings.gemini_model_name,
                            'early_detection': False
                        },
                        'word_count': len(consolidated_markdown.split()),
                        'char_count': len(consolidated_markdown)
                    }
                
            finally:
                # Clean up temporary file
                try:
                    temp_file_path.unlink()
                except Exception as e:
                    logger.warning(f"Failed to delete temp file: {e}")
                    
        except Exception as e:
            logger.error(f"Advanced PDF processing failed for {filename}: {e}")
            return {
                'processing_status': 'error',
                'error_message': str(e),
                'filename': filename,
                'extracted_text': '',
                'metadata': {'error': 'advanced_processing_failed'}
            }
    
    async def _extract_markdown_with_docling(self, pdf_path: Path) -> str:
        """Extract markdown using Docling"""
        try:
            logger.info(f"Processing {pdf_path.name} with Docling...")
            
            # Convert the PDF document
            conversion_result = self.docling_converter.convert(str(pdf_path))
            
            # Export the document content to Markdown
            if conversion_result and conversion_result.document:
                markdown_output = conversion_result.document.export_to_markdown()
                logger.info(f"✓ Successfully converted {pdf_path.name} to markdown with Docling")
                return markdown_output
            else:
                logger.warning(f"⚠ Could not convert the document with Docling: {pdf_path.name}")
                return ""
                
        except Exception as e:
            logger.error(f"❌ Error in Docling conversion for {pdf_path.name}: {str(e)}")
            return ""
    
    async def _extract_markdown_with_mistral(self, pdf_path: Path) -> str:
        """Extract markdown using Mistral OCR"""
        try:
            if not self.mistral_client:
                logger.warning("Mistral client not available")
                return ""
            
            logger.info(f"Processing {pdf_path.name} with Mistral OCR...")
            logger.info(f"   Mistral client: {type(self.mistral_client)}")
            logger.info(f"   File size: {pdf_path.stat().st_size} bytes")
            
            # Upload file to Mistral
            uploaded_file = self.mistral_client.files.upload(
                file={
                    "file_name": pdf_path.stem,
                    "content": pdf_path.read_bytes(),
                },
                purpose="ocr",
            )
            
            # Get signed URL
            signed_url = self.mistral_client.files.get_signed_url(
                file_id=uploaded_file.id, 
                expiry=1
            )
            
            # Process with OCR
            pdf_response = self.mistral_client.ocr.process(
                document=DocumentURLChunk(document_url=signed_url.url),
                model="mistral-ocr-latest",
                include_image_base64=True
            )
            
            # Parse response
            response_dict = json.loads(pdf_response.json())
            
            # Debug: Log the raw response structure
            logger.info(f"🔍 Mistral OCR raw response structure:")
            logger.info(f"   Keys: {list(response_dict.keys())}")
            if len(str(response_dict)) < 2000:  # Only log if response is reasonably small
                logger.info(f"   Full response: {json.dumps(response_dict, indent=2)}")
            else:
                logger.info(f"   Response too large ({len(str(response_dict))} chars), logging structure only")
                for key, value in response_dict.items():
                    if isinstance(value, list):
                        logger.info(f"   {key}: list with {len(value)} items")
                        if value and isinstance(value[0], dict):
                            logger.info(f"      First item keys: {list(value[0].keys())}")
                    elif isinstance(value, dict):
                        logger.info(f"   {key}: dict with keys {list(value.keys())}")
                    else:
                        logger.info(f"   {key}: {type(value).__name__} = {str(value)[:100]}...")
            
            # Extract markdown content from response
            markdown_content = self._extract_markdown_from_mistral_response(response_dict)
            
            logger.info(f"✓ Successfully processed {pdf_path.name} with Mistral OCR")
            return markdown_content
            
        except Exception as e:
            logger.error(f"❌ Error in Mistral OCR processing for {pdf_path.name}: {str(e)}")
            return ""
    
    def _extract_markdown_from_mistral_response(self, response_dict: Dict) -> str:
        """Extract markdown content from Mistral OCR response"""
        try:
            logger.info(f"🔍 Extracting markdown from Mistral response...")
            
            # The response structure may vary, so we'll extract text content
            # and format it as markdown
            content_parts = []
            
            if 'pages' in response_dict:
                logger.info(f"   Found 'pages' key with {len(response_dict['pages'])} pages")
                for page_num, page in enumerate(response_dict['pages'], 1):
                    logger.info(f"   Processing page {page_num}, keys: {list(page.keys())}")
                    
                    # The actual Mistral OCR response uses 'markdown' field
                    if 'markdown' in page:
                        markdown_content = page['markdown']
                        logger.info(f"   Found 'markdown' in page {page_num}: {len(markdown_content)} chars")
                        content_parts.append(f"# Page {page_num}\n\n")
                        content_parts.append(markdown_content)
                    elif 'text' in page:
                        text_content = page['text']
                        logger.info(f"   Found 'text' in page {page_num}: {len(text_content)} chars")
                        content_parts.append(f"# Page {page_num}\n\n")
                        content_parts.append(text_content)
                    elif 'content' in page:
                        content_text = page['content']
                        logger.info(f"   Found 'content' in page {page_num}: {len(content_text)} chars")
                        content_parts.append(f"# Page {page_num}\n\n")
                        content_parts.append(content_text)
                    else:
                        logger.warning(f"   No 'markdown', 'text', or 'content' found in page {page_num}")
                        logger.warning(f"   Available page keys: {list(page.keys())}")
                    
                    content_parts.append("\n\n")
            
            elif 'markdown' in response_dict:
                markdown_content = response_dict['markdown']
                logger.info(f"   Found 'markdown' at root level: {len(markdown_content)} chars")
                content_parts.append(markdown_content)
            elif 'text' in response_dict:
                text_content = response_dict['text']
                logger.info(f"   Found 'text' at root level: {len(text_content)} chars")
                content_parts.append(text_content)
            elif 'content' in response_dict:
                content_text = response_dict['content']
                logger.info(f"   Found 'content' at root level: {len(content_text)} chars")
                content_parts.append(content_text)
            else:
                logger.warning(f"   No 'pages', 'markdown', 'text', or 'content' found in response!")
                logger.warning(f"   Available keys: {list(response_dict.keys())}")
                
                # As a last resort, try to find any text-like content
                for key, value in response_dict.items():
                    if isinstance(value, str) and len(value) > 100:  # Likely content
                        logger.info(f"   Found potential content in '{key}': {len(value)} chars")
                        content_parts.append(value)
                        break
            
            final_content = ''.join(content_parts)
            logger.info(f"   Final extracted content: {len(final_content)} chars")
            
            if len(final_content.strip()) == 0:
                logger.error(f"❌ Mistral OCR returned empty content!")
                logger.error(f"   Response structure: {json.dumps(response_dict, indent=2)[:500]}...")
            
            return final_content
            
        except Exception as e:
            logger.error(f"Error extracting markdown from Mistral response: {e}")
            logger.error(f"Response type: {type(response_dict)}")
            logger.error(f"Response: {str(response_dict)[:200]}...")
            return str(response_dict)  # Fallback to string representation
    
    async def _consolidate_markdowns_with_gemini(
        self, 
        docling_markdown: str, 
        mistral_markdown: str, 
        filename: str
    ) -> str:
        """Consolidate two markdowns using Gemini (Request 1)"""
        try:
            model = genai.GenerativeModel(settings.gemini_model_name)
            
            consolidation_prompt = f"""
You are an expert document analyst. I have extracted markdown content from the same PDF document "{filename}" using two different methods:

1. **Docling Extraction**:
```markdown
{docling_markdown}
```

2. **Mistral OCR Extraction**:
```markdown
{mistral_markdown}
```

**Task**: Create a single, consolidated markdown that combines the best information from both extractions.

**Chain of Thought Process**:
1. Analyze both markdowns to identify overlapping content
2. Identify unique information present in only one extraction
3. Remove duplicate information while preserving all unique content
4. Maintain proper markdown structure and formatting
5. Ensure the consolidated version is comprehensive and well-organized

**Instructions**:
- These are two markdown representations of the same document
- There will be duplicate information between them
- One extraction might contain information missing from the other
- Combine them intelligently to create the most complete version
- Remove redundant/duplicate content
- Preserve proper markdown formatting
- Maintain logical document structure

**Output**: Return only the consolidated markdown content, no explanations.
"""
            
            response = model.generate_content(consolidation_prompt)
            consolidated_markdown = response.text
            
            logger.info("Successfully consolidated markdowns with Gemini")
            return consolidated_markdown
            
        except Exception as e:
            logger.error(f"Error consolidating markdowns with Gemini: {e}")
            # Fallback: combine both markdowns with headers
            fallback = f"# Document: {filename}\n\n## Docling Extraction\n\n{docling_markdown}\n\n## Mistral OCR Extraction\n\n{mistral_markdown}"
            return fallback
    
    async def _process_document_understanding_with_gemini(
        self, 
        consolidated_markdown: str, 
        filename: str
    ) -> str:
        """Process document understanding with Gemini (Request 2)"""
        try:
            model = genai.GenerativeModel(settings.gemini_model_name)
            
            understanding_prompt = f"""
You are an intelligent document assistant. I have processed and consolidated a document "{filename}" into the following markdown:

```markdown
{consolidated_markdown}
```

**Task**: Understand and analyze this document content thoroughly.

**Chain of Thought Process**:
1. Read through the entire document content
2. Identify key themes, topics, and main points
3. Understand the document structure and organization
4. Note important data, figures, dates, and entities
5. Prepare to answer questions about this document

**Instructions**:
- Analyze the document content comprehensively
- Understand the context, purpose, and key information
- Be ready to answer questions about any part of the document
- Maintain awareness of the document structure and details

**Response**: Reply with "I have understood the document '{filename}' and I'm ready to chat about its contents. I can help you find information, answer questions, and discuss any aspect of this document."

Do not include the document content in your response - just confirm your understanding.
"""
            
            response = model.generate_content(understanding_prompt)
            understanding_response = response.text
            
            logger.info("Successfully processed document understanding with Gemini")
            return understanding_response
            
        except Exception as e:
            logger.error(f"Error processing document understanding with Gemini: {e}")
            return f"I have processed the document '{filename}' and I'm ready to assist you with questions about its content."
    
    async def chat_with_document(
        self, 
        user_message: str, 
        consolidated_markdown: str, 
        filename: str,
        chat_history: Optional[list] = None
    ) -> str:
        """Chat with the document using Gemini"""
        try:
            model = genai.GenerativeModel(settings.gemini_model_name)
            
            # Build conversation context with enhanced system prompt
            context = f"""
You are an intelligent document assistant specializing in analyzing and discussing document content.

**Document Context**: You are chatting about the document "{filename}".

**Document Content**:
```markdown
{consolidated_markdown}
```

**System Instructions**:
1. **Primary Focus**: Always prioritize information from the document content provided above
2. **Document Summarization**: When asked about the document or for an overview, provide a comprehensive summary
3. **Accuracy**: Base all responses strictly on the document content
4. **Specificity**: Reference specific sections, data points, or details from the document
5. **Clarity**: If information isn't in the document, clearly state "This information is not available in the document"
6. **Context Awareness**: Maintain conversation context from previous messages
7. **Helpfulness**: Provide detailed, useful responses that help users understand the document

**Previous Conversation**:
"""
            
            if chat_history:
                for msg in chat_history[-5:]:  # Include last 5 messages for context
                    role = "User" if msg.get('sender') == 'user' else "Assistant"
                    context += f"{role}: {msg.get('content', '')}\n"
            
            context += f"""
**Current User Question**: {user_message}

**Response Guidelines**:
- Answer based on the document content provided above
- Be specific and reference relevant parts of the document
- If the user asks for a summary, provide a comprehensive overview of the document
- If the information isn't in the document, clearly state that
- Provide helpful, detailed, and accurate responses
- Maintain conversation context from previous messages
"""
            
            response = model.generate_content(context)
            return response.text
            
        except Exception as e:
            logger.error(f"Error in document chat: {e}")
            return "I apologize, but I encountered an error while processing your question. Please try again."
    
    def is_pdf_file(self, mime_type: str) -> bool:
        """Check if file is a PDF"""
        return mime_type == 'application/pdf'
    
    async def _detect_image_pdf_early(self, pdf_path: Path) -> bool:
        """
        Early detection of image-heavy PDFs by analyzing PDF structure
        before attempting text extraction
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            True if PDF appears to be image-heavy
        """
        try:
            import PyPDF2
            
            logger.info(f"Performing early image detection on: {pdf_path.name}")
            
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                # Check first few pages for text content
                pages_to_check = min(3, len(pdf_reader.pages))  # Check first 3 pages or all if less
                total_text_length = 0
                total_images = 0
                
                for page_num in range(pages_to_check):
                    page = pdf_reader.pages[page_num]
                    
                    # Extract text from page
                    try:
                        page_text = page.extract_text().strip()
                        # Clean text and count meaningful characters
                        clean_text = page_text.replace('\n', ' ').replace(' ', '')
                        total_text_length += len(clean_text)
                        
                        # Count images/graphics on the page
                        if '/XObject' in page.get('/Resources', {}):
                            xobjects = page['/Resources']['/XObject']
                            for obj_name in xobjects:
                                obj = xobjects[obj_name]
                                if obj.get('/Subtype') == '/Image':
                                    total_images += 1
                                    
                    except Exception as e:
                        logger.warning(f"Error analyzing page {page_num}: {e}")
                        continue
                
                # Calculate metrics
                avg_text_per_page = total_text_length / pages_to_check if pages_to_check > 0 else 0
                avg_images_per_page = total_images / pages_to_check if pages_to_check > 0 else 0
                
                # Thresholds for image-heavy detection
                MIN_TEXT_PER_PAGE = 50  # Less than 50 meaningful characters per page
                MIN_IMAGE_RATIO = 0.5   # At least 0.5 images per page
                
                is_image_heavy = (
                    avg_text_per_page < MIN_TEXT_PER_PAGE or 
                    (avg_images_per_page >= MIN_IMAGE_RATIO and avg_text_per_page < 100)
                )
                
                logger.info(f"Early detection results: "
                          f"avg_text_per_page={avg_text_per_page:.1f}, "
                          f"avg_images_per_page={avg_images_per_page:.1f}, "
                          f"total_pages={len(pdf_reader.pages)}, "
                          f"is_image_heavy={is_image_heavy}")
                
                return is_image_heavy
                
        except Exception as e:
            logger.error(f"Early image detection failed: {e}")
            # If detection fails, default to text processing (safer fallback)
            return False

    def _is_image_heavy_pdf(self, docling_markdown: str, mistral_markdown: str) -> bool:
        """
        Determine if PDF is image-heavy based on extracted text content
        
        Args:
            docling_markdown: Text extracted by Docling
            mistral_markdown: Text extracted by Mistral OCR
        
        Returns:
            True if PDF appears to be image-heavy (low text content)
        """
        # Calculate total meaningful text length (excluding whitespace)
        docling_clean = docling_markdown.strip().replace('\n', ' ').replace(' ', '')
        mistral_clean = mistral_markdown.strip().replace('\n', ' ').replace(' ', '')
        
        total_clean_chars = len(docling_clean) + len(mistral_clean)
        
        # Thresholds for determining image-heavy PDF
        MIN_TEXT_THRESHOLD = 200  # Less than 200 characters of meaningful text
        
        logger.info(f"Text analysis: Docling={len(docling_clean)} chars, Mistral={len(mistral_clean)} chars, Total={total_clean_chars} chars")
        
        is_image_heavy = total_clean_chars < MIN_TEXT_THRESHOLD
        
        if is_image_heavy:
            logger.info("PDF detected as image-heavy - will use direct Gemini processing")
        else:
            logger.info("PDF detected as text-heavy - will use standard AI pipeline")
            
        return is_image_heavy

    async def _process_image_pdf_with_gemini(self, file_content: bytes, filename: str) -> str:
        """
        Process image-heavy PDF directly with Gemini vision capabilities
        
        Args:
            file_content: PDF file content as bytes
            filename: Original filename
            
        Returns:
            Processed and summarized content from Gemini
        """
        try:
            logger.info(f"Processing image-heavy PDF {filename} with Gemini vision")
            
            # Upload file to Gemini
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
                temp_file.write(file_content)
                temp_file_path = temp_file.name
            
            try:
                # Upload PDF to Gemini
                uploaded_file = genai.upload_file(temp_file_path, mime_type='application/pdf')
                logger.info(f"Uploaded PDF to Gemini: {uploaded_file.name}")
                
                # Wait for processing to complete
                import time
                while uploaded_file.state.name == "PROCESSING":
                    logger.info("Waiting for Gemini to process the PDF...")
                    time.sleep(2)
                    uploaded_file = genai.get_file(uploaded_file.name)
                
                if uploaded_file.state.name == "FAILED":
                    raise Exception("Gemini failed to process the PDF")
                
                # Create model and process document
                model = genai.GenerativeModel(settings.gemini_model_name)
                
                # System prompt with summarization instruction
                image_pdf_prompt = f"""
You are an expert document analyst processing an image-heavy PDF document "{filename}".

**Primary Task**: Analyze this PDF document and provide a comprehensive summary.

**Instructions**:
1. **Summarize the document**: Extract and summarize all key information, content, and insights from this PDF
2. **Be comprehensive**: Include all important details, data, figures, charts, diagrams, and text content
3. **Structure your response**: Organize the summary in a clear, logical format using markdown
4. **Extract everything**: Don't miss any important information - this will be used for future conversations about the document
5. **Be detailed**: Provide enough detail so that someone reading your summary would understand the document's complete content

**Output Format**:
# Document Summary: {filename}

## Overview
[Brief overview of what this document is about]

## Key Content
[Detailed summary of all important content, organized by sections/topics]

## Important Data/Figures
[Any numerical data, charts, graphs, or important figures]

## Conclusions/Key Takeaways
[Main conclusions or key points from the document]

**Note**: This summary will be used for AI-powered conversations about the document content, so be thorough and accurate.
"""
                
                response = model.generate_content([uploaded_file, image_pdf_prompt])
                gemini_summary = response.text
                
                logger.info(f"Successfully processed image PDF with Gemini: {len(gemini_summary)} characters")
                
                # Clean up uploaded file
                genai.delete_file(uploaded_file.name)
                
                return gemini_summary
                
            finally:
                # Clean up temp file
                import os
                try:
                    os.unlink(temp_file_path)
                except Exception as e:
                    logger.warning(f"Failed to delete temp file: {e}")
                    
        except Exception as e:
            logger.error(f"Error processing image PDF with Gemini: {e}")
            return f"Error processing image-heavy PDF '{filename}': {str(e)}. Please try uploading the document again."

    async def get_processing_method(self, mime_type: str) -> str:
        """Determine which processing method to use"""
        if self.is_pdf_file(mime_type):
            return 'advanced_ai_pipeline'
        else:
            return 'basic_processing'