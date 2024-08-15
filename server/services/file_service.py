import tempfile
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from repositories.supabase_repository import SupabaseRepository
from repositories.pinecone_repository import PineconeRepository

class FileService:
    def __init__(self):
        self.supabase_repo = SupabaseRepository()
        self.pinecone_repo = PineconeRepository()

    def process_file(self, file):
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            file.save(temp_file.name)
            temp_file_path = temp_file.name

        try:
            # Upload to Supabase
            with open(temp_file_path, 'rb') as f:
                self.supabase_repo.upload_file(file.filename, f)

            # Process PDF
            loader = PyPDFLoader(temp_file_path)
            documents = loader.load()
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            texts = text_splitter.split_documents(documents)

            # Store in Pinecone
            self.pinecone_repo.add_documents(texts)

        finally:
            os.unlink(temp_file_path)

        return "File uploaded and processed successfully"