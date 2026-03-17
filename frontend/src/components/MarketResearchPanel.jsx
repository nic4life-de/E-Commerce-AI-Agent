import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { findMarketOpportunities } from '../services/api';
import MarketOpportunitiesCard from './MarketOpportunitiesCard';

export const MarketResearchPanel = () => {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      setError('Bitte geben Sie ein Produkt-Schlüsselwort ein');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await findMarketOpportunities(keyword);
      setData(response.data);
    } catch (err) {
      setError('Fehler bei der Marktanalyse. Bitte versuchen Sie es später erneut.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-lg p-6 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Produkt-Schlüsselwort
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setError(null);
              }}
              placeholder="z.B. Wireless Headphones, Smart Watch..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2 transition"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : <Search size={20} />}
            {loading ? 'Analyse läuft...' : 'Analysieren'}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>

      {/* Results */}
      {data && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <MarketOpportunitiesCard data={data} loading={loading} error={error} />
        </div>
      )}
    </div>
  );
};

export default MarketResearchPanel;
