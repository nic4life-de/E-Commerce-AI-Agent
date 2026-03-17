import React, { useState } from 'react';
import { Zap, Package, TrendingUp, Settings } from 'lucide-react';
import ErrorDiagnosisReport from '../components/ErrorDiagnosisReport';
import ProductRecommendationsCard from '../components/ProductRecommendationsCard';
import CrossSellUpsellStrategy from '../components/CrossSellUpsellStrategy';
import SEOAnalysisReport from '../components/SEOAnalysisReport';
import TrendProductDiscovery from '../components/TrendProductDiscovery';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const AdvancedAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState('seo');
  const [storeType] = useState('shopify');
  const [storeUrl, setStoreUrl] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Loading & Data States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seoData, setSeoData] = useState(null);
  const [crossSellData, setCrossSellData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [recommendationsData, setRecommendationsData] = useState(null);

  const handleGetProducts = async () => {
    if (!storeUrl) {
      setError('Bitte geben Sie eine Store URL ein');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/analyze-shop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_url: storeUrl, store_type: storeType })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          setSelectedProduct(data.products[0]);
        }
      }
    } catch (err) {
      setError('Fehler beim Laden der Produkte: ' + err.message);
    }
    setLoading(false);
  };

  const handleSEOAnalysis = async () => {
    if (!selectedProduct) {
      setError('Bitte wählen Sie ein Produkt aus');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/advanced/detailed-seo-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          title: selectedProduct.title,
          description: selectedProduct.description,
          category: selectedProduct.category
        })
      });
      if (response.ok) {
        const data = await response.json();
        setSeoData(data.analysis);
      } else {
        setError('SEO-Analyse fehlgeschlagen');
      }
    } catch (err) {
      setError('Fehler: ' + err.message);
    }
    setLoading(false);
  };

  const handleCrossSellUpsell = async () => {
    if (!selectedProduct) {
      setError('Bitte wählen Sie ein Produkt aus');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/advanced/cross-sell-upsell-strategy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          product_title: selectedProduct.title,
          product_price: selectedProduct.price,
          product_category: selectedProduct.category,
          sku: selectedProduct.sku
        })
      });
      if (response.ok) {
        const data = await response.json();
        setCrossSellData(data);
      } else {
        setError('Cross-Sell-Analyse fehlgeschlagen');
      }
    } catch (err) {
      setError('Fehler: ' + err.message);
    }
    setLoading(false);
  };

  const handleTrendDiscovery = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/advanced/trend-product-discovery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_url: storeUrl,
          store_type: storeType,
          limit: 15
        })
      });
      if (response.ok) {
        const data = await response.json();
        setTrendData(data.trending_products || data.trends);
      } else {
        setError('Trend-Analyse fehlgeschlagen');
      }
    } catch (err) {
      setError('Fehler: ' + err.message);
    }
    setLoading(false);
  };

  const handleDiagnosis = async () => {
    if (!storeUrl) {
      setError('Bitte geben Sie eine Store URL ein');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/advanced/diagnose-shop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_url: storeUrl, store_type: storeType })
      });
      if (response.ok) {
        const data = await response.json();
        setDiagnosisData(data);
      } else {
        setError('Diagnose fehlgeschlagen');
      }
    } catch (err) {
      setError('Fehler: ' + err.message);
    }
    setLoading(false);
  };

  const handleProductRecommendations = async () => {
    if (!selectedProduct) {
      setError('Bitte wählen Sie ein Produkt aus');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/advanced/product-recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          product_title: selectedProduct.title,
          product_category: selectedProduct.category
        })
      });
      if (response.ok) {
        const data = await response.json();
        setRecommendationsData(data);
      } else {
        setError('Empfehlungen fehlgeschlagen');
      }
    } catch (err) {
      setError('Fehler: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
          <Zap size={36} />
          Erweiterte Analysen
        </h1>
        <p className="text-purple-100 text-lg">
          ✨ Detaillierte SEO-Audits, Cross-Sell-Strategien & Trend-Entdeckung
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-purple-300 transition-colors duration-300 shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Settings size={22} className="text-purple-600" />
          Store-Verbindung
        </h3>
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-64">
            <input
              type="url"
              placeholder="https://your-store.com"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-300"
            />
          </div>
          <button
            onClick={handleGetProducts}
            disabled={loading || !storeUrl}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Laden...' : '📦 Produkte laden'}
          </button>
        </div>
        {selectedProduct && (
          <p className="text-sm text-green-600 mt-3 font-semibold">
            ✓ Produkt ausgewählt: {selectedProduct.title}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-red-800 animate-fade-in">
          ⚠️ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border-b-2 border-gray-200 overflow-hidden ">
        <div className="flex overflow-x-auto">
          {[
            { id: 'seo', label: '🔍 SEO-Audit', icon: 'SEO' },
            { id: 'crosssell', label: '🛒 Cross-Sell/Up-Sell', icon: 'CROSS' },
            { id: 'trends', label: '📈 Trend-Entdeckung', icon: 'TREND' },
            { id: 'diagnosis', label: '⚕️ Fehlerdiagnose', icon: 'DIAG' },
            { id: 'recommendations', label: '💡 Empfehlungen', icon: 'REC' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-semibold flex items-center gap-2 border-b-4 transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-600 hover:text-purple-600 hover:border-purple-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg p-6 shadow-sm animate-fade-in">
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">🔍 SEO-Analyse & Optimierungen</h2>
              <button
                onClick={handleSEOAnalysis}
                disabled={loading || !selectedProduct}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? '⏳ Analysiere...' : '🚀 SEO-Audit starten'}
              </button>
            </div>
            {seoData ? (
              <SEOAnalysisReport analysis={seoData} loading={false} />
            ) : (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
                <p className="text-gray-700 mb-4">📊 Wählen Sie ein Produkt und klicken Sie auf "SEO-Audit starten"</p>
                <p className="text-sm text-gray-600">
                  Erhalten Sie detaillierte Empfehlungen für Meta-Tags, Titel, Keywords und Struktur-Markup
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'crosssell' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">🛒 Cross-Sell & Up-Sell Strategie</h2>
              <button
                onClick={handleCrossSellUpsell}
                disabled={loading || !selectedProduct}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? '⏳ Analysiere...' : '📊 Strategie generieren'}
              </button>
            </div>
            {crossSellData ? (
              <CrossSellUpsellStrategy strategy={crossSellData} loading={false} />
            ) : (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-8 text-center">
                <p className="text-gray-700 mb-4">🎯 Wählen Sie ein Produkt und klicken Sie auf "Strategie generieren"</p>
                <p className="text-sm text-gray-600">
                  Erhalten Sie personalisierte Empfehlungen zur Steigerung des durchschnittlichen Bestellwerts (AOV)
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">📈 Trend-Produkt Entdeckung</h2>
              <button
                onClick={handleTrendDiscovery}
                disabled={loading || !storeUrl}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? '⏳ Suche...' : '🔍 Trends analysieren'}
              </button>
            </div>
            {trendData ? (
              <TrendProductDiscovery trends={trendData} loading={false} />
            ) : (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
                <p className="text-gray-700 mb-4">🚀 Klicken Sie auf "Trends analysieren" um neue Marktchancen zu entdecken</p>
                <p className="text-sm text-gray-600">
                  Wir analysieren eBay und TikTok Daten, um hochprofitable Produkttrends zu identifizieren
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'diagnosis' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">⚕️ Shop-Fehlerdiagnose</h2>
              <button
                onClick={handleDiagnosis}
                disabled={loading || !storeUrl}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? '⏳ Diagnostiziere...' : '🔧 Diagnose durchführen'}
              </button>
            </div>
            {diagnosisData ? (
              <ErrorDiagnosisReport diagnosis={diagnosisData} loading={false} />
            ) : (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
                <p className="text-gray-700 mb-4">🔍 Klicken Sie auf "Diagnose durchführen" um kritische Fehler zu finden</p>
                <p className="text-sm text-gray-600">
                  Automatische Analyse von Performance-Problemen, UX-Lücken und kritischen Konfigurationsfehlern
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">💡 Produktempfehlungen</h2>
              <button
                onClick={handleProductRecommendations}
                disabled={loading || !selectedProduct}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? '⏳ Generiere...' : '🎁 Empfehlungen generieren'}
              </button>
            </div>
            {recommendationsData ? (
              <ProductRecommendationsCard recommendations={recommendationsData} loading={false} />
            ) : (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-8 text-center">
                <p className="text-gray-700 mb-4">🎯 Wählen Sie ein Produkt und klicken Sie auf "Empfehlungen generieren"</p>
                <p className="text-sm text-gray-600">
                  KI-gestützte Empfehlungen für komplementäre Produkte, Bundle-Optionen und Rabattwerte
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom CSS für Animationen */}
      <style jsx>{`
        @keyframes fade-in {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdvancedAnalysisPage;
