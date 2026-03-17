import React from 'react';
import { Settings, AlertCircle, Code } from 'lucide-react';

export const SettingsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Settings size={32} />
          <h1 className="text-3xl font-bold">Einstellungen</h1>
        </div>
        <p className="text-gray-300">Konfiguriere deine E-Commerce Plattformen und API-Keys</p>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Code size={24} />
          API Konfiguration
        </h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Shopify</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p><span className="font-medium">API Key:</span> Zu konfigurieren in .env</p>
              <p><span className="font-medium">Store URL:</span> Format: your-store.myshopify.com</p>
              <p className="text-xs">Erstelle einen privaten App im Shopify Admin</p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">WooCommerce</h3>
            <div className="space-y-2 text-sm text-purple-800">
              <p><span className="font-medium">API Key & Secret:</span> Zu konfigurieren in .env</p>
              <p><span className="font-medium">Store URL:</span> Deine WordPress Installation</p>
              <p className="text-xs">Generiere Keys in WooCommerce → Settings → REST API</p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-semibold text-orange-900 mb-2">eBay API</h3>
            <div className="space-y-2 text-sm text-orange-800">
              <p><span className="font-medium">API Key:</span> Zu konfigurieren in .env</p>
              <p className="text-xs">Benötigt eBay Developer Account</p>
            </div>
          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <h3 className="font-semibold text-pink-900 mb-2">TikTok API</h3>
            <div className="space-y-2 text-sm text-pink-800">
              <p><span className="font-medium">API Key:</span> Zu konfigurieren in .env</p>
              <p className="text-xs">Benötigt TikTok Business Account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Setup */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-yellow-900">
          <AlertCircle size={24} />
          Umgebungsvariablen
        </h2>
        <p className="text-yellow-800 mb-4">Kopiere die .env.example Datei und benenne sie in .env um:</p>
        <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-sm">
{`cp backend/.env.example backend/.env
# Bearbeite backend/.env und füge deine API Keys ein`}
        </pre>
      </div>

      {/* Backend Setup */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Backend Installation</h2>
        <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-sm">
{`# 1. Gehe in Backend Verzeichnis
cd backend

# 2. Installiere Dependencies
pip install -r requirements.txt

# 3. Starte den Server
python main.py

# Server läuft auf http://localhost:8000`}
        </pre>
      </div>

      {/* Frontend Setup */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-900">Frontend Installation</h2>
        <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-sm">
{`# 1. Gehe in Frontend Verzeichnis
cd frontend

# 2. Installiere Dependencies
npm install

# 3. Starte die Entwicklungs-App
npm start

# App läuft auf http://localhost:3000`}
        </pre>
      </div>
    </div>
  );
};

export default SettingsPage;
