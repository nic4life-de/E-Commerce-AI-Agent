import React, { useState } from 'react';
import { BarChart3, TrendingUp, Search, Settings } from 'lucide-react';
import ShopAnalysisReport from '../components/ShopAnalysisReport';
import { analyzeShop } from '../services/api';

export const DashboardPage = () => {
  const [storeType, setStoreType] = useState('shopify');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyzeShop(storeType);
      setAnalysisData(response.data);
    } catch (err) {
      setError('Fehler bei der Shop-Analyse. Bitte überprüfen Sie Ihre API-Einstellungen.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 size={32} />
          <h1 className="text-3xl font-bold">Shop-Analyse Dashboard</h1>
        </div>
        <p className="text-blue-100">Umfassende Analyse deines Shops auf SEO, UX und Konversionspotenzial</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop-Plattform
            </label>
            <select
              value={storeType}
              onChange={(e) => setStoreType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="shopify">Shopify</option>
              <option value="woocommerce">WooCommerce</option>
            </select>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2 transition"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Analysiere...
              </>
            ) : (
              <>
                <TrendingUp size={20} />
                Shop analysieren
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisData && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <ShopAnalysisReport data={analysisData} loading={loading} error={error} />
        </div>
      )}

      {/* Empty State */}
      {!analysisData && !loading && (
        <div className="bg-white rounded-lg p-12 shadow-sm text-center">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Starten Sie eine Analyse</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Wählen Sie Ihre Shop-Plattform und klicken Sie auf "Shop analysieren" um detaillierte Erkenntnisse zu erhalten.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
