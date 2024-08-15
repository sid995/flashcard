from pinecone import Pinecone
from langchain_community.vectorstores import Pinecone as LangchainPinecone
from langchain_openai import OpenAIEmbeddings
from config import Config

class PineconeRepository:
    def __init__(self):
        config = Config()
        self.pc = Pinecone(api_key=config.PINECONE_API_KEY)
        self.embeddings = OpenAIEmbeddings(openai_api_key=config.OPENAI_API_KEY)
        self.index_name = config.PINECONE_INDEX_NAME

    def add_documents(self, texts):
        vectorstore = LangchainPinecone.from_existing_index(self.index_name, self.embeddings)
        vectorstore.add_documents(texts)

    def similarity_search(self, query, k=5):
        vectorstore = LangchainPinecone.from_existing_index(self.index_name, self.embeddings)
        return vectorstore.similarity_search(query, k=k)