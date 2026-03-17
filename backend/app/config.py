"""
Konfiguration für die E-Commerce AI Agent Anwendung
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # API Keys
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    SHOPIFY_API_KEY = os.getenv("SHOPIFY_API_KEY", "")
    SHOPIFY_STORE_URL = os.getenv("SHOPIFY_STORE_URL", "")
    WOOCOMMERCE_API_KEY = os.getenv("WOOCOMMERCE_API_KEY", "")
    WOOCOMMERCE_API_SECRET = os.getenv("WOOCOMMERCE_API_SECRET", "")
    WOOCOMMERCE_STORE_URL = os.getenv("WOOCOMMERCE_STORE_URL", "")
    
    # EBAY und TikTok Integration
    EBAY_API_KEY = os.getenv("EBAY_API_KEY", "")
    TIKTOK_API_KEY = os.getenv("TIKTOK_API_KEY", "")
    
    # Server
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./shop_agent.db")
    
    # Frontend URL
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
settings = Settings()
