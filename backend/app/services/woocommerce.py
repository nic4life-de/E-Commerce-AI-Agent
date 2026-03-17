"""
Service für WooCommerce API Integration
"""
import httpx
import base64
from typing import List, Dict, Any, Optional
from app.config import settings
from app.models.product import Product


class WooCommerceService:
    def __init__(self):
        self.api_key = settings.WOOCOMMERCE_API_KEY
        self.api_secret = settings.WOOCOMMERCE_API_SECRET
        self.store_url = settings.WOOCOMMERCE_STORE_URL
        self.base_url = f"{self.store_url}/wp-json/wc/v3"
        
        # Basic Auth
        credentials = f"{self.api_key}:{self.api_secret}"
        encoded = base64.b64encode(credentials.encode()).decode()
        self.headers = {
            "Authorization": f"Basic {encoded}",
            "Content-Type": "application/json"
        }
    
    async def get_products(self, page: int = 1, per_page: int = 100) -> List[Dict[str, Any]]:
        """Produkte von WooCommerce abrufen"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/products?page={page}&per_page={per_page}",
                    headers=self.headers
                )
                return response.json() if response.status_code == 200 else []
        except Exception as e:
            print(f"WooCommerce API Error: {e}")
            return []
    
    async def get_product_details(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Detaillierte Produktinformationen abrufen"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/products/{product_id}",
                    headers=self.headers
                )
                return response.json() if response.status_code == 200 else None
        except Exception as e:
            print(f"WooCommerce API Error: {e}")
            return None
    
    async def get_orders(self, page: int = 1) -> List[Dict[str, Any]]:
        """Bestellungen abrufen"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/orders?page={page}",
                    headers=self.headers
                )
                return response.json() if response.status_code == 200 else []
        except Exception as e:
            print(f"WooCommerce API Error: {e}")
            return []
    
    def convert_to_product(self, woo_product: Dict) -> Product:
        """WooCommerce Produkt zu standardisiertem Format konvertieren"""
        return Product(
            id=str(woo_product["id"]),
            title=woo_product.get("name", ""),
            description=woo_product.get("description", ""),
            price=float(woo_product.get("price", 0)),
            sku=woo_product.get("sku", ""),
            store="woocommerce",
            url=woo_product.get("permalink", ""),
            image_url=woo_product.get("images", [{}])[0].get("src"),
            created_at=woo_product.get("date_created"),
            updated_at=woo_product.get("date_modified")
        )
