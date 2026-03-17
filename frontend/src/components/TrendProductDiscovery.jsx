import React, { useState } from 'react';
import { TrendingUp, Zap, AlertTriangle, Target, BarChart3, Clock } from 'lucide-react';

export const TrendProductDiscovery = ({ trends, loading }) => {
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [sortBy, setSortBy] = useState('revenue');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Analysiere Markttrends...</p>
        </div>
      </div>
    );
  }

  if (!trends || trends.length === 0) {
    return null;
  }

  const sortedTrends = [...trends].sort((a, b) => {
    if (sortBy === 'revenue') {
      return (b.revenue_potential?.annual || 0) - (a.revenue_potential?.annual || 0);
    } else if (sortBy === 'growth') {
      return (b.ebay_data?.growth_percentage || 0) - (a.ebay_data?.growth_percentage || 0);
    } else if (sortBy === 'confidence') {
      return (b.confidence_score || 0) - (a.confidence_score || 0);
    }
    return 0;
  });

  const getCompetitionColor = (level) => {
    if (level === 'low') return 'bg-green-100 text-green-800 border-green-300';
    if (level === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getTrendTypeIcon = (type) => {
    if (type === 'rising') return '📈';
    if (type === 'emerging') return '🚀';
    return '⭐';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <TrendingUp size={32} />
              Trend-Produkt Chancen
            </h2>
            <p className="text-green-100">Erkannte Markttrends mit Revenue-Potenzial</p>
          </div>
          <div className="text-6xl opacity-20">📊</div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex gap-3 flex-wrap">
        {[
          { value: 'revenue', label: '💰 Nach Umsatzpotenzial', icon: '💹' },
          { value: 'growth', label: '📈 Nach Wachstum', icon: '🔥' },
          { value: 'confidence', label: '⭐ Nach Confidence', icon: '✨' }
        ].map(option => (
          <button
            key={option.value}
            onClick={() => setSortBy(option.value)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
              sortBy === option.value
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {option.icon} {option.label}
          </button>
        ))}
      </div>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedTrends.map((trend, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedTrend(selectedTrend === idx ? null : idx)}
            className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-green-400 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl"
          >
            {/* Background gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-300 rounded-full opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>

            <div className={`p-6 bg-gradient-to-br ${
              trend.trend_type === 'rising' ? 'from-green-50 to-emerald-50' :
              trend.trend_type === 'emerging' ? 'from-blue-50 to-cyan-50' :
              'from-purple-50 to-pink-50'
            }`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {getTrendTypeIcon(trend.trend_type)} {trend.keyword}
                  </h3>
                  <p className={`text-sm font-semibold inline-block px-3 py-1 rounded-full border-2 ${
                    trend.trend_type === 'rising' ? 'bg-green-200 text-green-800 border-green-400' :
                    trend.trend_type === 'emerging' ? 'bg-blue-200 text-blue-800 border-blue-400' :
                    'bg-purple-200 text-purple-800 border-purple-400'
                  }`}>
                    {trend.trend_type === 'rising' ? '📈 Stark Wachsend' :
                     trend.trend_type === 'emerging' ? '🚀 Emerging' :
                     '⭐ Stabil'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-md">
                  <p className="text-2xl font-bold text-center">
                    <span className={`${trend.confidence_score >= 80 ? 'text-green-600' : trend.confidence_score >= 60 ? 'text-yellow-600' : 'text-orange-600'}`}>
                      {trend.confidence_score}%
                    </span>
                  </p>
                  <p className="text-xs text-gray-600 text-center">Confidence</p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white rounded-lg p-3 border-2 border-green-200 hover:border-green-400 transition-colors duration-300">
                  <p className="text-xs text-gray-600 mb-1">💰 Jahres-Umsatzpotenzial</p>
                  <p className="text-lg font-bold text-green-600">
                    {trend.revenue_potential?.annual?.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'}) || 'N/A'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border-2 border-blue-200 hover:border-blue-400 transition-colors duration-300">
                  <p className="text-xs text-gray-600 mb-1">📈 Wachstum</p>
                  <p className="text-lg font-bold text-blue-600">
                    +{trend.ebay_data?.growth_percentage || 0}%
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border-2 border-orange-200 hover:border-orange-400 transition-colors duration-300">
                  <p className="text-xs text-gray-600 mb-1">🏪 eBay Listings</p>
                  <p className="text-lg font-bold text-orange-600">
                    {trend.ebay_data?.total_listings?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border-2 border-purple-200 hover:border-purple-400 transition-colors duration-300">
                  <p className="text-xs text-gray-600 mb-1">🎬 TikTok Trends</p>
                  <p className="text-lg font-bold text-purple-600">
                    {trend.tiktok_data?.trend_score || 0} 🔥
                  </p>
                </div>
              </div>

              {/* Competition & Risk */}
              <div className="flex gap-3 mb-4">
                <div className={`flex-1 rounded-lg p-3 border-2 ${getCompetitionColor(trend.competition_level)} text-center font-bold`}>
                  🎯 {trend.competition_level === 'low' ? 'Niedrig' : trend.competition_level === 'medium' ? 'Mittel' : 'Hoch'}
                </div>
                <div className={`flex-1 rounded-lg p-3 border-2 ${
                  trend.risk_level === 'low' ? 'bg-green-100 text-green-800 border-green-300' :
                  trend.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                  'bg-red-100 text-red-800 border-red-300'
                } text-center font-bold`}>
                  ⚠️ {trend.risk_level === 'low' ? 'Niedrig' : trend.risk_level === 'medium' ? 'Mittel' : 'Hoch'}
                </div>
              </div>

              {/* Expandable Details */}
              {selectedTrend === idx && (
                <div className="animate-slide-down bg-white rounded-lg p-4 border-t-2 border-gray-200 mt-4 space-y-4">
                  {/* Trend Details */}
                  <div>
                    <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <BarChart3 size={18} />
                      Marktdetails
                    </h5>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">
                        <span className="font-semibold">Durch. Preis:</span> {trend.ebay_data?.avg_price?.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'}) || 'N/A'}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Nachfrage-Trend:</span> {trend.ebay_data?.demand_trend || 'Stabil'}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Top-Verkäufer:</span> {trend.ebay_data?.top_sellers || '5-10'}
                      </p>
                    </div>
                  </div>

                  {/* TikTok Data */}
                  <div>
                    <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Zap size={18} className="text-purple-600" />
                      TikTok Viralität
                    </h5>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">
                        <span className="font-semibold">Mentions:</span> {trend.tiktok_data?.mentions?.toLocaleString() || 0}+
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Trend Score:</span> {trend.tiktok_data?.trend_score || 0}/100
                      </p>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  {trend.risk_assessment && (
                    <div>
                      <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-orange-600" />
                        Risikoanalyse
                      </h5>
                      <div className="space-y-2 text-sm">
                        {trend.risk_assessment.risks && trend.risk_assessment.risks.map((risk, ridx) => (
                          <p key={ridx} className="text-gray-700 flex gap-2">
                            <span className="text-orange-600">⚠️</span>
                            <span>{risk}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {trend.recommendations && (
                    <div>
                      <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Target size={18} className="text-green-600" />
                        Aktionsplan
                      </h5>
                      <div className="space-y-2">
                        {trend.recommendations.map((rec, ridx) => (
                          <div key={ridx} className="flex gap-2 text-sm">
                            <span className="font-bold text-green-600">→</span>
                            <span className="text-gray-700">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Catalog Fit */}
                  {trend.catalog_fit && (
                    <div className={`rounded-lg p-3 border-2 ${
                      trend.catalog_fit.is_fit
                        ? 'bg-green-50 border-green-300 text-green-800'
                        : 'bg-blue-50 border-blue-300 text-blue-800'
                    }`}>
                      <p className="text-sm font-semibold">
                        {trend.catalog_fit.is_fit ? '✓ Passt zu Deinem Katalog' : '📝 Neue Produktkategorie'}
                      </p>
                      {trend.catalog_fit.reason && (
                        <p className="text-xs mt-1">{trend.catalog_fit.reason}</p>
                      )}
                    </div>
                  )}

                  {/* Call to Action */}
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                    <TrendingUp size={20} />
                    Produkt hinzufügen & Research starten
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-300">
        <h3 className="font-bold text-lg text-blue-900 mb-4">📊 Marktpotenzial zusammengefasst</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
            <p className="text-sm text-gray-600 mb-1">💰 Gesamt Jahrespotenzial</p>
            <p className="text-2xl font-bold text-blue-600">
              {trends.reduce((sum, t) => sum + (t.revenue_potential?.annual || 0), 0).toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
            <p className="text-sm text-gray-600 mb-1">🚀 High-Confidence Trends</p>
            <p className="text-2xl font-bold text-purple-600">
              {trends.filter(t => t.confidence_score >= 80).length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-green-200">
            <p className="text-sm text-gray-600 mb-1">🎯 Marktchancen</p>
            <p className="text-2xl font-bold text-green-600">
              {trends.length}
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS für Animationen */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-down {
          from { 
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
          to { 
            opacity: 1;
            transform: translateY(0);
            max-height: 1000px;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-in;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TrendProductDiscovery;
