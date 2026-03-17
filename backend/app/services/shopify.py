"""
Service für Shopify API Integration
"""
import httpx
from typing import List, Dict, Any, Optional
from app.config import settings
from app.models.product import Product, ProductBase


class ShopifyService:
    def __init__(self):
        self.api_key = settings.SHOPIFY_API_KEY
        self.store_url = settings.SHOPIFY_STORE_URL
        self.base_url = f"https://{self.store_url}/admin/api/2024-01"
        self.headers = {
            "X-Shopify-Access-Token": self.api_key,
            "Content-Type": "application/json"
        }
    
    async def get_products(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Alle Produkte von Shopify abrufen"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/products.json?limit={limit}",
                    headers=self.headers
                )
                return response.json().get("products", [])
        except Exception as e:
            print(f"Shopify API Error: {e}")
            return []
    
    async def get_product_details(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Detaillierte Produktinformationen abrufen"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/products/{product_id}.json",
                    headers=self.headers
                )
                return response.json().get("product")
        except Exception as e:
            print(f"Shopify API Error: {e}")
            return None
    
    async def get_shop_info(self) -> Optional[Dict[str, Any]]:
        """Shop-Informationen abrufen"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/shop.json",
                    headers=self.headers
                )
                return response.json().get("shop")
        except Exception as e:
            print(f"Shopify API Error: {e}")
            return None
    
    def convert_to_product(self, shopify_product: Dict) -> Product:
        """Shopify Produkt zu standardisiertem Format konvertieren"""
        variant = shopify_product.get("variants", [{}])[0]
        return Product(
            id=str(shopify_product["id"]),
            title=shopify_product.get("title", ""),
            description=shopify_product.get("body_html", ""),
            price=float(variant.get("price", 0)),
            sku=variant.get("sku", ""),
            store="shopify",
            url=shopify_product.get("handle", ""),
            image_url=shopify_product.get("image", {}).get("src"),
            created_at=shopify_product.get("created_at"),
            updated_at=shopify_product.get("updated_at")
        )
