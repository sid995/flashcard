from anthropic import Anthropic
from config import Config

class AnthropicService:
    def __init__(self):
        config = Config()
        self.client = Anthropic(api_key=config.ANTHROPIC_API_KEY)

    def generate_response(self, prompt):
        response = self.client.completions.create(
            model="claude-3-sonnet-20240229",
            prompt=prompt,
            max_tokens_to_sample=1000
        )
        return response.completion