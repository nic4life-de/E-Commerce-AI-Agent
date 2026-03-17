import React, { useState } from 'react';
import { TrendingUp, ShoppingCart, DollarSign, Target } from 'lucide-react';

export const CrossSellUpsellStrategy = ({ strategy, loading }) => {
  const [expandedSection, setExpandedSection] = useState('upsell');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Analysiere Cross-Sell und Up-Sell Chancen...</p>
        </div>
      </div>
    );
  }

  if (!strategy) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Base Product */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200 animate-fade-in">
        <h3 className="font-bold text-lg text-blue-900 mb-2">📦 Basis Produkt</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-900 font-semibold">{strategy.base_product?.title}</p>
            <p className="text-blue-700 text-lg font-bold mt-1">
              {strategy.base_product?.price?.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}
            </p>
          </div>
          <div className="text-4xl">📍</div>
        </div>
      </div>

      {/* Combined Strategy Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AOV ohne */}
        <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105 cursor-pointer">
          <p className="text-sm text-gray-600 font-medium mb-2">Aktueller AOV</p>
          <p className="text-3xl font-bold text-gray-900">
            {strategy.base_product?.price?.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}
          </p>
          <p className="text-xs text-gray-500 mt-2">Durchschnittlicher Bestellwert</p>
        </div>

        {/* Mit Cross-Sell */}
        <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:scale-105 cursor-pointer group">
          <p className="text-sm text-orange-600 font-medium mb-2 group-hover:font-bold">Mit Cross-Sell</p>
          <p className="text-3xl font-bold text-orange-900">
            {strategy.cross_sell?.potential_aov?.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}
          </p>
          <p className="text-sm text-orange-700 mt-2 font-semibold">{strategy.cross_sell?.aov_increase}</p>
        </div>

        {/* Mit UP-Sell + Cross-Sell */}
        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:scale-105 cursor-pointer group animate-pulse-slow">
          <p className="text-sm text-green-600 font-medium mb-2 group-hover:font-bold">✨ Optimal (UP+Cross)</p>
          <p className="text-3xl font-bold text-green-900">
            {strategy.combined_strategy?.total_potential_aov?.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}
          </p>
          <p className="text-sm text-green-700 mt-2 font-semibold">{strategy.combined_strategy?.total_potential_increase}</p>
        </div>
      </div>

      {/* Strategy Sections */}
      <div className="space-y-4">
        {/* UP-Sell Section */}
        <div className="border-2 border-purple-200 rounded-lg overflow-hidden transition-all duration-300">
          <button
            onClick={() => setExpandedSection(expandedSection === 'upsell' ? null : 'upsell')}
            className="w-full bg-purple-50 hover:bg-purple-100 p-4 flex items-center justify-between transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="text-purple-600" size={24} />
              <div className="text-left">
                <h4 className="font-bold text-purple-900">Up-Sell Strategie</h4>
                <p className="text-sm text-purple-700">{strategy.upsell?.recommendations?.length} Premium-Optionen</p>
              </div>
            </div>
            <div className={`transform transition-transform duration-300 ${expandedSection === 'upsell' ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </button>

          {expandedSection === 'upsell' && (
            <div className="p-6 space-y-4 bg-purple-50 animate-slide-down">
              {strategy.upsell?.recommendations?.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 border-l-4 border-purple-400 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-bold text-gray-900">{rec.title}</h5>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">Score: {rec.score}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Preis</p>
                      <p className="text-lg font-bold text-purple-600">
                        {rec.price?.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Steigerung</p>
                      <p className="text-lg font-bold text-green-600">+{rec.price_increase_percent?.toFixed(0)}%</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{rec.reason}</p>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors duration-300 font-medium">
                    Zu Up-Sell hinzufügen
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cross-Sell Section */}
        <div className="border-2 border-orange-200 rounded-lg overflow-hidden transition-all duration-300">
          <button
            onClick={() => setExpandedSection(expandedSection === 'cross' ? null : 'cross')}
            className="w-full bg-orange-50 hover:bg-orange-100 p-4 flex items-center justify-between transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="text-orange-600" size={24} />
              <div className="text-left">
                <h4 className="font-bold text-orange-900">Cross-Sell Empfehlungen</h4>
                <p className="text-sm text-orange-700">{strategy.cross_sell?.recommendations?.length} komplementäre Produkte</p>
              </div>
            </div>
            <div className={`transform transition-transform duration-300 ${expandedSection === 'cross' ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </button>

          {expandedSection === 'cross' && (
            <div className="p-6 space-y-4 bg-orange-50 animate-slide-down">
              {strategy.cross_sell?.recommendations?.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 border-l-4 border-orange-400 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-bold text-gray-900">{rec.title}</h5>
                    <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">Score: {rec.score}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-lg font-bold text-orange-600">
                      {rec.price?.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}
                    </p>
                    <p className="text-sm text-gray-600">{rec.reason}</p>
                  </div>
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded transition-colors duration-300 font-medium">
                    Hinzufügen
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-200">
        <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
          <Target size={20} />
          Implementierungs-Sequence
        </h4>
        <ol className="space-y-2 text-sm text-indigo-800">
          <li className="flex gap-2">
            <span className="font-bold text-indigo-600">1.</span>
            <span><strong>Zeige UP-Sell zuerst</strong> - Erhöhter Preis = höherer Gewinn</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-indigo-600">2.</span>
            <span><strong>Dann Cross-Sell</strong> - Komplementäre Produkte zum Bundle hinzufügen</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-indigo-600">3.</span>
            <span><strong>Bundle-Rabatt</strong> - 10% Rabatt auf Gesamtkauf</span>
          </li>
        </ol>
        <div className="mt-4 p-3 bg-white rounded border-l-4 border-indigo-600">
          <p className="text-sm font-semibold text-indigo-900">
            💡 Expected Conversion Boost: <span className="text-green-600">{strategy.combined_strategy?.expected_conversion_boost}</span>
          </p>
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
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-in;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default CrossSellUpsellStrategy;
