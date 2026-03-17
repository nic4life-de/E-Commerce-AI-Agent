import React from 'react';
import { Package, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';

export const ProductRecommendationsCard = ({ recommendations, bundle, loading, error }) => {
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
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Bundle Angebot */}
      {bundle && Object.keys(bundle).length > 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">✨ {bundle.bundle_name}</h3>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-purple-100 mb-2">{bundle.products?.length || 0} Produkte im Bundle</p>
              <div className="flex gap-3 items-end">
                <span className="text-xl font-bold">{bundle.bundle_price?.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}</span>
                <span className="text-sm opacity-75 line-through">{bundle.regular_price?.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{bundle.savings_percent}%</p>
              <p className="text-purple-100">Rabatt sparen</p>
            </div>
          </div>
          <button className="w-full mt-4 bg-white text-purple-600 font-bold py-2 rounded-lg hover:bg-gray-100 transition">
            Bundle zum Warenkorb
          </button>
        </div>
      )}

      {/* Empfehlung Karten */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Package size={24} />
          Empfohlene Ergänzungsprodukte
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition">
              {/* Bild */}
              {rec.product_image && (
                <div className="w-full h-40 bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
                  <img src={rec.product_image} alt={rec.product_title} className="h-full object-contain" />
                </div>
              )}

              {/* Content */}
              <h4 className="font-bold text-gray-900 mb-1 line-clamp-2 text-sm">
                {rec.product_title}
              </h4>

              {/* Score */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                    style={{width: `${rec.score}%`}}
                  ></div>
                </div>
                <span className="text-xs font-bold text-gray-900">{rec.score}</span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Preis:</span>
                  <span className="font-bold"><DollarSign size={14} className="inline mr-1" />{rec.product_price?.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Grund:</span>
                  <span className="text-purple-600 font-medium text-xs">{rec.reason}</span>
                </div>
              </div>

              {/* Upsell Value */}
              <div className="bg-green-50 rounded p-2 mb-3 text-xs text-green-800">
                <TrendingUp size={14} className="inline mr-1" />
                Möglicher Upsell: {rec.potential_upsell?.toFixed(2)} €
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition text-sm font-medium">
                  <ShoppingCart size={14} className="inline mr-1" />
                  Hinzufügen
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition text-sm font-medium">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tipp:</strong> Diese Produkte werden häufig zusammen gekauft. Mit Cross-Selling können Sie den durchschnittlichen Bestellwert um 15-25% erhöhen.
        </p>
      </div>
    </div>
  );
};

export default ProductRecommendationsCard;
