import React, { useState } from 'react';
import { BarChart3, Search, Settings, Menu, X, Zap } from 'lucide-react';
import './styles/animations.css';
import DashboardPage from './pages/Dashboard';
import MarketResearchPage from './pages/MarketResearch';
import AdvancedAnalysisPage from './pages/AdvancedAnalysis';
import SettingsPage from './pages/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Shop-Analyse', icon: BarChart3 },
    { id: 'market-research', label: 'Marktforschung', icon: Search },
    { id: 'advanced', label: 'Erweiterte Analysen', icon: Zap },
    { id: 'settings', label: 'Einstellungen', icon: Settings },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'market-research':
        return <MarketResearchPage />;
      case 'advanced':
        return <AdvancedAnalysisPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const handleMenuClick = (pageId) => {
    setCurrentPage(pageId);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block fixed md:relative w-64 bg-gray-900 text-white z-50 h-full transition-all`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold">E-Commerce AI</h1>
          <p className="text-gray-400 text-sm">Shop Optimizer</p>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 transition ${
                  currentPage === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-300 mb-2">💡 Tipp:</p>
          <p className="text-xs text-gray-400">Starten Sie mit der Shop-Analyse, um Optimierungspotenziale zu entdecken.</p>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {menuItems.find(m => m.id === currentPage)?.label}
            </h2>
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
              A
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {renderPage()}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
