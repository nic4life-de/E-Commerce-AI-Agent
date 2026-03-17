"""
API Routes für Shop-Analyse und Marktforschung
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.agents.ecommerce_agent import ECommerceAIAgent
from app.models.product import ProductAnalysis, MarketAnalysis, ShopAnalysisReport

router = APIRouter(prefix="/api", tags=["analysis"])


@router.post("/analyze-shop")
async def analyze_shop(store_type: str = Query("shopify", description="Shopify oder WooCommerce")):
    """
    Analysiere den kompletten Shop auf SEO, UX und Konversionspotenzial
    """
    try:
        agent = ECommerceAIAgent(store_type=store_type)
        report = await agent.analyze_shop()
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/market-opportunities")
async def find_market_opportunities(product_keyword: str = Query(..., description="Produkt-Schlüsselwort")):
    """
    Analysiere Marktchancen auf Web, eBay und TikTok
    """
    try:
        agent = ECommerceAIAgent()
        analysis = await agent.find_market_opportunities(product_keyword)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health Check Endpoint"""
    return {"status": "ok", "message": "E-Commerce AI Agent is running"}
