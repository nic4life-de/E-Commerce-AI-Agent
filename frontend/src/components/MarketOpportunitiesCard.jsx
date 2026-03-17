import React from 'react';
import { TrendingUp, AlertCircle, DollarSign } from 'lucide-react';

export const MarketOpportunitiesCard = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header with Product Name */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{data.product_name}</h3>
        <div className="flex items-center gap-2 opacity-90">
          <TrendingUp size={20} />
          <span>Marktanalyse & Chancen</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Web Demand */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium mb-2">Web-Nachfrage (schätzungsweise)</p>
          <p className="text-3xl font-bold text-blue-900">{data.web_demand?.toLocaleString() || 0}</p>
          <p className="text-xs text-blue-700 mt-2">Monatliche Suchanfragen (schätzungsweise)</p>
        </div>

        {/* Revenue Potential */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium mb-2">Umsatzpotenzial</p>
          <p className="text-3xl font-bold text-green-900">{formatCurrency(data.potential_revenue || 0)}</p>
          <p className="text-xs text-green-700 mt-2">Basierend auf Marktanalyse</p>
        </div>

        {/* eBay Listings */}
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <p className="text-sm text-orange-600 font-medium mb-2">eBay Listings</p>
          <p className="text-3xl font-bold text-orange-900">{data.ebay_listings?.toLocaleString() || 0}</p>
          <p className="text-xs text-orange-700 mt-2">
            Ø Preis: {formatCurrency(data.ebay_avg_price || 0)}
          </p>
        </div>

        {/* TikTok Trend */}
        <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
          <p className="text-sm text-pink-600 font-medium mb-2">TikTok Trend-Score</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-pink-900">{data.tiktok_trend_score || 0}</p>
            <p className="text-lg text-pink-700">/100</p>
          </div>
          <p className="text-xs text-pink-700 mt-2">
            {data.tiktok_mentions?.toLocaleString() || 0} Erwähnungen
          </p>
        </div>
      </div>

      {/* Demand Trend */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
        <h4 className="font-medium text-indigo-900 mb-2">eBay Nachfrage-Trend</h4>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            data.ebay_demand_trend === 'up' ? 'bg-green-100 text-green-800' :
            data.ebay_demand_trend === 'down' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {data.ebay_demand_trend === 'up' ? '📈 Steigend' :
             data.ebay_demand_trend === 'down' ? '📉 Fallend' :
             '➡️ Stabil'}
          </span>
        </div>
      </div>

      {/* Market Gaps */}
      {data.market_gaps && data.market_gaps.length > 0 && (
        <div>
          <h4 className="font-semibold text-lg mb-4">Erkannte Marktlücken</h4>
          <div className="space-y-2">
            {data.market_gaps.map((gap, idx) => (
              <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-amber-800">{gap}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Nächste Schritte</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="font-bold text-purple-600 mt-0.5">1.</span>
            <span>Bewerte die Konkurrenz auf eBay (Listings: {data.ebay_listings})</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-purple-600 mt-0.5">2.</span>
            <span>Analysiere TikTok Creator mit hohem Engagement</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-purple-600 mt-0.5">3.</span>
            <span>Teste Preisstrategien basierend auf eBay Durchschnitt</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-purple-600 mt-0.5">4.</span>
            <span>Starte eine Influencer-Kampagne wenn Trend-Score hoch ist</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MarketOpportunitiesCard;
