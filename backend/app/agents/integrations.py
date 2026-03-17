"""
Integration der Fehlerdiagnose und Produktempfehlungen in den Haupt-Agent
"""
from app.agents.error_diagnosis import ErrorDiagnosisEngine
from app.agents.recommendation_engine import ProductRecommendationEngine


async def enhance_product_with_recommendations(product_dict, all_products):
    """Erweitere Produkt mit Empfehlungen"""
    engine = ProductRecommendationEngine()
    
    # Konvertiere zu standardisiertem Format
    from app.models.product import Product
    product = Product(**product_dict)
    
    recommendations = await engine.get_recommendations(product, all_products)
    bundle = engine.get_recommended_bundle(product, recommendations)
    
    return {
        "complementary_products": recommendations,
        "suggested_bundle": bundle
    }


async def enhance_shop_analysis_with_diagnosis(shop_analysis, products):
    """Erweitere Shop-Analyse mit detaillierter Fehlerdiagnose"""
    diagnosis_engine = ErrorDiagnosisEngine()
    
    issues = await diagnosis_engine.diagnose_shop(products)
    action_plan = diagnosis_engine.generate_action_plan(issues)
    
    return {
        "diagnosed_issues": issues,
        "action_plan": action_plan,
        "quick_wins": [
            issue for issue_list in [issues.get("critical", []), issues.get("high", [])]
            for issue in issue_list
            if issue.get("effort") == "Niedrig"
        ][:5]
    }
