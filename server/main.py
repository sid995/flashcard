from flask import Flask, request, jsonify
from anthropic import Anthropic
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
import pinecone
import os

app = Flask(__name__)

# Initialize Anthropic client
anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Initialize Pinecone
pinecone.init(api_key=os.getenv("PINECONE_API_KEY"), environment=os.getenv("PINECONE_ENVIRONMENT"))
index_name = "flashcards"

# Initialize OpenAI Embeddings
embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/generate_flashcards', methods=['POST'])
def generate_flashcards():
    prompt = request.json['prompt']
    
    response = anthropic.completions.create(
        model="claude-3-sonnet-20240229",
        prompt=f"Create flashcards based on the following prompt: {prompt}",
        max_tokens_to_sample=1000
    )
    
    flashcards = response.completion
    
    return jsonify({"flashcards": flashcards})

@app.route('/upload_pdf', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and file.filename.endswith('.pdf'):
        file_path = os.path.join('uploads', file.filename)
        file.save(file_path)
        
        # Load and process PDF
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        
        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        texts = text_splitter.split_documents(documents)
        
        # Create vector store
        vectorstore = Pinecone.from_documents(texts, embeddings, index_name=index_name)
        
        return jsonify({"message": "PDF uploaded and processed successfully"}), 200
    
    return jsonify({"error": "Invalid file format"}), 400

@app.route('/query_pdf', methods=['POST'])
def query_pdf():
    query = request.json['query']
    
    # Query the vector store
    vectorstore = Pinecone.from_existing_index(index_name, embeddings)
    results = vectorstore.similarity_search(query, k=5)
    
    # Generate response using Claude 3.5
    context = "\n".join([doc.page_content for doc in results])
    response = anthropic.completions.create(
        model="claude-3-sonnet-20240229",
        prompt=f"Based on the following context, answer this query: {query}\n\nContext: {context}",
        max_tokens_to_sample=1000
    )
    
    return jsonify({"response": response.completion})

if __name__ == '__main__':
    app.run(debug=True)