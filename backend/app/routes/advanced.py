"""
Erweiterte API Routes für Fehlerdiagnose und Produktempfehlungen
"""
from fastapi import APIRouter, HTTPException, Query
from app.agents.ecommerce_agent import ECommerceAIAgent
from app.agents.error_diagnosis import ErrorDiagnosisEngine
from app.agents.recommendation_engine import ProductRecommendationEngine
from app.agents.integrations import enhance_shop_analysis_with_diagnosis, enhance_product_with_recommendations

router = APIRouter(prefix="/api/advanced", tags=["advanced-analysis"])


@router.post("/diagnose-shop")
async def diagnose_shop_problems(store_type: str = Query("shopify", description="Shopify oder WooCommerce")):
    """
    Detaillierte Fehlerdiagnose mit Action Plan
    """
    try:
        agent = ECommerceAIAgent(store_type=store_type)
        products = await agent.store_service.get_products()
        
        # Shop-Analyse
        shop_analysis = await agent.analyze_shop()
        
        # Fehlerdiagnose
        diagnosis_result = await enhance_shop_analysis_with_diagnosis(shop_analysis, products)
        
        return {
            **shop_analysis.dict(),
            "diagnosis": diagnosis_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/product-recommendations")
async def get_product_recommendations(
    product_id: str = Query(..., description="Produkt ID"),
    store_type: str = Query("shopify", description="Shopify oder WooCommerce")
):
    """
    Intelligente Produktempfehlungen für ein spezifisches Produkt
    """
    try:
        agent = ECommerceAIAgent(store_type=store_type)
        
        # Alle Produkte abrufen
        all_products_raw = await agent.store_service.get_products()
        all_products = [agent.store_service.convert_to_product(p) for p in all_products_raw]
        
        # Spezifisches Produkt finden
        target_product_raw = await agent.store_service.get_product_details(product_id)
        if not target_product_raw:
            raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
        
        target_product = agent.store_service.convert_to_product(target_product_raw)
        
        # Empfehlungen generieren
        recommendation_result = await enhance_product_with_recommendations(target_product, all_products)
        
        return {
            "product_id": product_id,
            "product_title": target_product.title,
            **recommendation_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/bulk-analyze")
async def bulk_analyze_products(
    store_type: str = Query("shopify", description="Shopify oder WooCommerce"),
    limit: int = Query(50, description="Maximal Produkte zu analysieren")
):
    """
    Analysiere alle Produkte für Empfehlungen und Diagnose
    """
    try:
        agent = ECommerceAIAgent(store_type=store_type)
        products_raw = await agent.store_service.get_products(limit=limit)
        
        results = []
        for product in products_raw:
            product_obj = agent.store_service.convert_to_product(product)
            details = await enhance_product_with_recommendations(product_obj, [agent.store_service.convert_to_product(p) for p in products_raw])
            
            results.append({
                "product_id": product_obj.id,
                "product_title": product_obj.title,
                "complementary_products": details.get("complementary_products", []),
                "suggested_bundle": details.get("suggested_bundle", {})
            })
        
        return {
            "total_products_analyzed": len(results),
            "products": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analyze-multiple-keywords")
async def analyze_multiple_keywords(keywords: str = Query(..., description="Komma-getrennte Keywords")):
    """
    Analysiere mehrere Produkt-Keywords gleichzeitig
    """
    try:
        keyword_list = [kw.strip() for kw in keywords.split(",")]
        agent = ECommerceAIAgent()
        
        results = []
        for keyword in keyword_list[:10]:  # Max 10 für Performance
            analysis = await agent.find_market_opportunities(keyword)
            results.append(analysis.dict())
        
        return {
            "keywords_analyzed": len(results),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/cross-sell-upsell-strategy")
async def get_crosssell_upsell_strategy(
    product_id: str = Query(..., description="Produkt ID"),
    store_type: str = Query("shopify", description="Shopify oder WooCommerce")
):
    """
    Generiere Cross-Sell und Up-Sell Strategie für ein Produkt
    """
    try:
        from app.agents.crosssell_upsell import CrossSellingEngine, UpSellingEngine
        
        agent = ECommerceAIAgent(store_type=store_type)
        
        # Hole alle Produkte
        all_products_raw = await agent.store_service.get_products(limit=100)
        all_products = [agent.store_service.convert_to_product(p) for p in all_products_raw]
        
        # Hole Zielprodukt
        target_product_raw = await agent.store_service.get_product_details(product_id)
        if not target_product_raw:
            raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
        
        target_product = agent.store_service.convert_to_product(target_product_raw)
        
        # Cross-Sell
        cross_sell_engine = CrossSellingEngine()
        cross_sell_recs = await cross_sell_engine.get_cross_sell_recommendations(
            target_product, all_products
        )
        
        # Up-Sell
        upsell_engine = UpSellingEngine()
        upsell_recs = await upsell_engine.get_upsell_recommendations(
            target_product, all_products
        )
        
        # Kombinierte Strategie
        strategy = upsell_engine.generate_combined_strategy(
            target_product, cross_sell_recs, upsell_recs
        )
        
        return strategy
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/detailed-seo-analysis")
async def get_detailed_seo_analysis(
    product_id: str = Query(..., description="Produkt ID"),
    store_type: str = Query("shopify", description="Shopify oder WooCommerce")
):
    """
    Detaillierte SEO-Analyse mit Meta-Tag und Title Empfehlungen
    """
    try:
        from app.agents.seo_analysis import SEOAnalysisEngine
        
        agent = ECommerceAIAgent(store_type=store_type)
        
        # Hole Produkt-Details
        product_raw = await agent.store_service.get_product_details(product_id)
        if not product_raw:
            raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
        
        # SEO-Analyse
        seo_engine = SEOAnalysisEngine()
        analysis = await seo_engine.analyze_product(product_raw)
        
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/trend-product-discovery")
async def discover_trend_products(
    store_type: str = Query("shopify", description="Shopify oder WooCommerce")
):
    """
    Entdecke trend-basierte neue Produkte von eBay und TikTok
    """
    try:
        from app.agents.trend_detection import TrendDetectionEngine
        
        agent = ECommerceAIAgent(store_type=store_type)
        
        # Hole aktuelle Produkte
        current_products = await agent.store_service.get_products(limit=100)
        
        # Marktforschungsdaten (simuliert - in Produktion würde das echte API-Daten sein)
        ebay_analysis_sample = await agent.ebay_service.analyze_market("wireless earbuds")
        tiktok_analysis_sample = await agent.tiktok_service.analyze_product_trend("wireless earbuds")
        
        # Trend-Erkennung
        trend_engine = TrendDetectionEngine()
        trend_products = await trend_engine.identify_trend_products(
            ebay_analysis_sample,
            tiktok_analysis_sample,
            current_products
        )
        
        return {
            "trend_products_found": len(trend_products),
            "products": trend_products,
            "analysis_date": "2024-01-01",
            "recommendations": [
                p["recommendation"] for p in trend_products[:5]
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
