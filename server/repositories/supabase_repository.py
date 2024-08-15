from supabase import create_client, Client
from config import Config

class SupabaseRepository:
    def __init__(self):
        if not Config.SUPABASE_URL or not Config.SUPABASE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in the environment")
        self.supabase: Client = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)

    def upload_file(self, file_name, file_content):
        return self.supabase.storage.from_("pdfs").upload(file_name, file_content)