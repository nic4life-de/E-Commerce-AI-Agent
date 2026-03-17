import React from 'react';
import { Search, Zap, TrendingUp, Package } from 'lucide-react';
import MarketResearchPanel from '../components/MarketResearchPanel';

export const MarketResearchPage = () => {
  const features = [
    {
      icon: <Search className="text-blue-600" size={24} />,
      title: 'Web-Nachfrage',
      description: 'Schätze das Suchvolumen eines Produkts im Web'
    },
    {
      icon: <Package className="text-orange-600" size={24} />,
      title: 'eBay Marktanalyse',
      description: 'Finde Konkurrenzpreise und Nachfragetrends'
    },
    {
      icon: <Zap className="text-pink-600" size={24} />,
      title: 'TikTok Trends',
      description: 'Erkenne virale Trends und Social Media Einfluss'
    },
    {
      icon: <TrendingUp className="text-green-600" size={24} />,
      title: 'Umsatzpotenzial',
      description: 'Berechne das finanzielle Potenzial eines Produktes'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Search size={32} />
          <h1 className="text-3xl font-bold">Marktforschung</h1>
        </div>
        <p className="text-purple-100">Entdecke neue Produkte und analysiere ihr Marktpotenzial auf Web, eBay und TikTok</p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="mb-3">{feature.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Search Panel */}
      <div className="bg-white rounded-lg shadow-sm">
        <MarketResearchPanel />
      </div>
    </div>
  );
};

export default MarketResearchPage;
