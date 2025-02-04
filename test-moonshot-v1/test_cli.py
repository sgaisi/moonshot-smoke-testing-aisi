from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

AZURE_OPENAI_URI = os.getenv('AZURE_OPENAI_URI')
AZURE_OPENAI_TOKEN = os.getenv('AZURE_OPENAI_TOKEN')
CLI_DIR = os.getenv('CLI_DIR')
def test_cli_benchmark():
    assert True