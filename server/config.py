import os
from dotenv import load_dotenv
from pathlib import Path

# Determine if we're running in a production environment
# You might want to set this environment variable in your production environment
IS_PRODUCTION = os.getenv('FLASK_ENV') == 'production'

if not IS_PRODUCTION:
    # Load .env file only in development
    current_dir = Path(__file__).resolve().parent
    dotenv_path = current_dir / '.env'
    if dotenv_path.exists():
        print(f"Loading .env from: {dotenv_path}")
        load_dotenv(dotenv_path=dotenv_path)
    else:
        print(f"Warning: .env file not found at {dotenv_path}")

class Config:
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY')
    PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
    ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    PINECONE_INDEX_NAME = os.getenv('PINECONE_INDEX_NAME')

    @classmethod
    def validate(cls):
        required_vars = [
            'SUPABASE_URL',
            'SUPABASE_KEY',
            'PINECONE_API_KEY',
            'OPENAI_API_KEY',
            'PINECONE_INDEX_NAME'
        ]
        for var in required_vars:
            if not getattr(cls, var):
                raise ValueError(f"{var} is not set. Please check your environment variables.")

    @classmethod
    def print_debug_info(cls):
        print("Environment variables:")
        for var in ['SUPABASE_URL', 'SUPABASE_KEY', 'PINECONE_API_KEY', 'ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'PINECONE_INDEX_NAME']:
            # Mask sensitive information in logs
            value = getattr(cls, var)
            masked_value = value[:4] + '*' * (len(value) - 4) if value else None
            print(f"{var}: {masked_value}")

# Print debug info when the module is loaded (be cautious with this in production)
if not IS_PRODUCTION:
    Config.print_debug_info()