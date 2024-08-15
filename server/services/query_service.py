from repositories.pinecone_repository import PineconeRepository

class QueryService:
    def __init__(self):
        self.pinecone_repo = PineconeRepository()

    def query_documents(self, query):
        results = self.pinecone_repo.similarity_search(query)
        context = "\n".join([doc.page_content for doc in results])
        return context