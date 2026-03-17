import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, TrendingUp, Zap, Copy, Check, Code, Tag, FileText } from 'lucide-react';

export const ShopAnalysisReport = ({ data, loading, error }) => {
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Analysiere deinen Shop...</p>
        </div>
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

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Shop-Bewertung</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold">{data.overall_score}</span>
          <span className="text-2xl">/100</span>
        </div>
        <p className="mt-2 opacity-90">
          {data.overall_score >= 80 ? 'Ausgezeichnet!' : 
           data.overall_score >= 60 ? 'Gut, aber verbesserungsbedürftig' : 
           'Viele Optimierungspotenziale'}
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(data.performance_metrics || {}).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">{key.replace(/_/g, ' ')}</p>
            <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toFixed(1) : value}</p>
          </div>
        ))}
      </div>

      {/* Issues */}
      <div>
        <h4 className="font-semibold text-lg mb-4">Identifizierte Probleme</h4>
        <div className="space-y-3">
          {/* SEO Issues */}
          {data.seo_issues && data.seo_issues.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h5 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                <AlertCircle size={18} />
                SEO-Probleme ({data.seo_issues.length})
              </h5>
              <ul className="list-disc list-inside space-y-1 text-yellow-800">
                {data.seo_issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {/* UX Issues */}
          {data.ux_issues && data.ux_issues.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h5 className="font-medium text-orange-900 mb-2 flex items-center gap-2">
                <Zap size={18} />
                UX-Probleme ({data.ux_issues.length})
              </h5>
              <ul className="list-disc list-inside space-y-1 text-orange-800">
                {data.ux_issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* SEO Meta Tags & Title Recommendations - NEW SECTION */}
      {data.seo_recommendations && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-200">
          <h4 className="font-bold text-xl text-indigo-900 mb-6 flex items-center gap-3">
            <Code size={24} className="text-indigo-600" />
            📝 SEO Meta Tags & Title Optimierungen
          </h4>
          
          <div className="space-y-5">
            {/* Title Tag Recommendation */}
            {data.seo_recommendations.title && (
              <div className="bg-white rounded-lg p-5 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <Tag size={20} className="text-purple-600" />
                    Title Tag
                  </h5>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-bold">Kritisch</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">✨ Empfohlener Title:</p>
                    <div className="bg-green-50 border-2 border-green-300 rounded p-3 relative group">
                      <code className="text-sm text-green-900 font-mono break-words">
                        &lt;title&gt;{data.seo_recommendations.title}&lt;/title&gt;
                      </code>
                      <button
                        onClick={() => handleCopy(`<title>${data.seo_recommendations.title}</title>`, 'title-tag')}
                        className="absolute top-2 right-2 p-2 hover:bg-green-200 rounded transition-colors duration-300"
                        title="In Zwischenablage kopieren"
                      >
                        {copied === 'title-tag' ? (
                          <Check size={18} className="text-green-600" />
                        ) : (
                          <Copy size={18} className="text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-green-700 font-medium">
                    💡 Länge: {data.seo_recommendations.title.length} Zeichen (Ideal: 50-60)
                  </p>
                </div>
              </div>
            )}

            {/* Meta Description Recommendation */}
            {data.seo_recommendations.meta_description && (
              <div className="bg-white rounded-lg p-5 border-l-4 border-pink-500 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <FileText size={20} className="text-pink-600" />
                    Meta Description
                  </h5>
                  <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-bold">Wichtig</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">✨ Empfohlen Meta-Description:</p>
                    <div className="bg-green-50 border-2 border-green-300 rounded p-3 relative group">
                      <code className="text-sm text-green-900 font-mono break-words">
                        &lt;meta name="description" content="{data.seo_recommendations.meta_description}" /&gt;
                      </code>
                      <button
                        onClick={() => handleCopy(`<meta name="description" content="${data.seo_recommendations.meta_description}" />`, 'meta-tag')}
                        className="absolute top-2 right-2 p-2 hover:bg-green-200 rounded transition-colors duration-300"
                        title="In Zwischenablage kopieren"
                      >
                        {copied === 'meta-tag' ? (
                          <Check size={18} className="text-green-600" />
                        ) : (
                          <Copy size={18} className="text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-green-700 font-medium">
                    💡 Länge: {data.seo_recommendations.meta_description.length} Zeichen (Ideal: 150-160)
                  </p>
                </div>
              </div>
            )}

            {/* Implementation Guide */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-5 border-2 border-blue-200">
              <h6 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <CheckCircle size={20} className="text-blue-600" />
                Schnelle Implementierung
              </h6>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-3">
                  <span className="font-bold bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">1</span>
                  <span>Klicken Sie bei den Tags oben auf das <strong>Copy-Icon</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">2</span>
                  <span>Öffnen Sie Ihren <strong>Shop Admin</strong> (Shopify, WooCommerce, etc.)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">3</span>
                  <span><strong>Ersetzen</strong> Sie den alten Title und Meta durch die neuen Werte</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">4</span>
                  <span><strong>Speichern</strong> Sie die Änderungen</span>
                </li>
              </ol>
              <p className="text-xs text-blue-700 mt-3 font-semibold">
                ⏱️ Implementierungszeit: ca. 2-3 Minuten pro Seite
              </p>
            </div>

            {/* Expected Impact */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border-2 border-green-200">
              <h6 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <TrendingUp size={20} className="text-green-600" />
                Erwartete Auswirkungen
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">+15-25%</p>
                  <p className="text-xs text-green-700">Impressionen</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">+20-30%</p>
                  <p className="text-xs text-green-700">Click-Through Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">+5-10%</p>
                  <p className="text-xs text-green-700">Rankings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div>
        <h4 className="font-semibold text-lg mb-4">Top Empfehlungen</h4>
        <div className="space-y-3">
          {data.recommendations && data.recommendations.map((rec, idx) => (
            <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h5 className="font-medium text-green-900">
                    {rec.category} - {rec.priority}
                  </h5>
                  <p className="text-green-800 mt-1">{rec.action}</p>
                  <p className="text-sm text-green-700 mt-2 flex items-center gap-1">
                    <TrendingUp size={14} />
                    {rec.estimated_impact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Opportunities */}
      {data.revenue_opportunities && data.revenue_opportunities.length > 0 && (
        <div>
          <h4 className="font-semibold text-lg mb-4">Umsatzchancen</h4>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-2">
            {data.revenue_opportunities.map((opp, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <TrendingUp className="text-purple-600 mt-1 flex-shrink-0" />
                <p className="text-purple-800">{opp}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopAnalysisReport;
