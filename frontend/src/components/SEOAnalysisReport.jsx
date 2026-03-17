import React, { useState } from 'react';
import { Copy, Check, AlertCircle, CheckCircle, Zap, Code, Tag, FileText } from 'lucide-react';

export const SEOAnalysisReport = ({ analysis, loading }) => {
  const [copied, setCopied] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyHTMLTag = (tag, id) => {
    navigator.clipboard.writeText(tag);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Analysiere SEO Faktoren...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100 border-green-300';
    if (score >= 60) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const getSeverityColor = (type) => {
    if (type === 'critical') return 'border-red-400 bg-red-50';
    if (type === 'high') return 'border-orange-400 bg-orange-50';
    return 'border-yellow-400 bg-yellow-50';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overall SEO Score */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-lg mb-2">SEO Gesamtbewertung</p>
            <h2 className="text-5xl font-bold">{analysis.overall_seo_score}/100</h2>
          </div>
          <div className="text-right">
            <div className="text-7xl opacity-30">📊</div>
            <p className="text-blue-100 text-sm mt-2">
              {analysis.overall_seo_score >= 80 ? '✨ Ausgezeichnet' : 
               analysis.overall_seo_score >= 60 ? '🎯 Gut' : 
               '⚠️ Verbesserung nötig'}
            </p>
          </div>
        </div>
      </div>

      {/* HTML Implementation Guide - NEW SECTION */}
      {analysis.title && analysis.meta && (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg p-8 border-2 border-indigo-200 animate-fade-in">
          <h3 className="font-bold text-2xl text-indigo-900 mb-6 flex items-center gap-3">
            <Code size={28} className="text-indigo-600" />
            📝 HTML Meta Tags & Title - Implementierungs-Guide
          </h3>
          
          <div className="space-y-6">
            {/* Title Tag */}
            <div className="bg-white rounded-lg p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Tag size={20} className="text-purple-600" />
                  Title Tag (SEO-kritisch)
                </h4>
                <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-bold">
                  Score: {analysis.title.score}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">❌ Aktueller Title (nicht optimal):</p>
                  <div className="bg-red-50 border border-red-200 rounded p-3 relative group">
                    <code className="text-sm text-red-900 font-mono break-words">
                      &lt;title&gt;{analysis.title.current_title}&lt;/title&gt;
                    </code>
                    <span className="text-xs text-red-600 block mt-1">
                      Länge: {analysis.title.current_title_length} Zeichen (Ideal: 50-60)
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">✨ Empfohlener Title (optimiert):</p>
                  <div className="bg-green-50 border-2 border-green-300 rounded p-3 relative group hover:shadow-md transition-all duration-300">
                    <code className="text-sm text-green-900 font-mono break-words">
                      &lt;title&gt;{analysis.title.optimized_title}&lt;/title&gt;
                    </code>
                    <span className="text-xs text-green-600 block mt-1">
                      Länge: {analysis.title.optimized_title.length} Zeichen ✓
                    </span>
                    <button
                      onClick={() => handleCopyHTMLTag(`<title>${analysis.title.optimized_title}</title>`, 'title-tag')}
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
              </div>

              {analysis.title.recommendations && (
                <div className="bg-blue-50 rounded p-3 border-l-4 border-blue-400">
                  <p className="text-sm font-semibold text-blue-900 mb-2">💡 Verbesserungstipps:</p>
                  <ul className="space-y-1">
                    {analysis.title.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-blue-800 flex gap-2">
                        <span className="text-blue-600 font-bold">→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Meta Description Tag */}
            <div className="bg-white rounded-lg p-6 border-l-4 border-pink-500 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <FileText size={20} className="text-pink-600" />
                  Meta Description Tag (Click-Through-Optimierung)
                </h4>
                <span className="px-3 py-1 bg-pink-600 text-white rounded-full text-sm font-bold">
                  Score: {analysis.meta.score}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">❌ Aktuelle Meta-Description (nicht optimal):</p>
                  <div className="bg-red-50 border border-red-200 rounded p-3 relative group">
                    <code className="text-sm text-red-900 font-mono break-words">
                      &lt;meta name="description" content="{analysis.meta.current_meta}" /&gt;
                    </code>
                    <span className="text-xs text-red-600 block mt-1">
                      Länge: {analysis.meta.current_meta_length} Zeichen (Ideal: 150-160)
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">✨ Empfohlen Meta-Description (optimiert):</p>
                  <div className="bg-green-50 border-2 border-green-300 rounded p-3 relative group hover:shadow-md transition-all duration-300">
                    <code className="text-sm text-green-900 font-mono break-words">
                      &lt;meta name="description" content="{analysis.meta.optimized_meta}" /&gt;
                    </code>
                    <span className="text-xs text-green-600 block mt-1">
                      Länge: {analysis.meta.optimized_meta.length} Zeichen ✓
                    </span>
                    <button
                      onClick={() => handleCopyHTMLTag(`<meta name="description" content="${analysis.meta.optimized_meta}" />`, 'meta-tag')}
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
              </div>

              {analysis.meta.has_cta ? (
                <div className="bg-green-50 rounded p-3 border-l-4 border-green-400 flex items-center gap-2">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                  <span className="text-sm font-semibold text-green-800">✓ Call-to-Action vorhanden</span>
                </div>
              ) : (
                <div className="bg-orange-50 rounded p-3 border-l-4 border-orange-400">
                  <p className="text-sm font-semibold text-orange-900 mb-2">⚠️ Verbesserungstipps:</p>
                  <ul className="space-y-1">
                    {[
                      "Füge ein Call-to-Action ein (z.B. 'Jetzt kaufen', 'Kostenlos testen')",
                      "Verwende actionorientierte Verben (z.B. 'Entdecke', 'Erhalten', 'Bestelle')",
                      "Inkludiere wichtige Keywords für bessere Relevanz"
                    ].map((tip, idx) => (
                      <li key={idx} className="text-sm text-orange-800 flex gap-2">
                        <span className="text-orange-600 font-bold">→</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Implementation Steps */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
              <h5 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <CheckCircle size={22} className="text-blue-600" />
                Implementierungs-Schritte
              </h5>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-3">
                  <span className="font-bold bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                  <span><strong>Kopiere</strong> den empfohlenen Title Tag</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                  <span><strong>Gehe</strong> zu deinem Shop Admin / Page Header</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                  <span><strong>Ersetze</strong> den aktuellen Title</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                  <span><strong>Wiederhole</strong> mit der Meta-Description</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">5</span>
                  <span><strong>Speichere</strong> und teste mit Google Search Console</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { key: 'title', label: '🏷️ Titel', icon: '📝', color: 'from-purple-50 to-purple-100' },
          { key: 'meta', label: '📄 Meta-Description', icon: '📋', color: 'from-blue-50 to-blue-100' },
          { key: 'content', label: '📖 Content', icon: '✍️', color: 'from-green-50 to-green-100' },
          { key: 'keywords', label: '🔑 Keywords', icon: '🎯', color: 'from-orange-50 to-orange-100' },
          { key: 'links', label: '🔗 Links', icon: '⛓️', color: 'from-pink-50 to-pink-100' },
          { key: 'structured_data', label: '⚙️ Schema', icon: '🏗️', color: 'from-indigo-50 to-indigo-100' }
        ].map(section => analysis[section.key] && (
          <div
            key={section.key}
            className={`rounded-lg p-4 border-2 border-gray-200 bg-gradient-to-br ${section.color} hover:shadow-md hover:border-gray-300 transition-all duration-300 cursor-pointer transform hover:scale-105`}
            onClick={() => toggleExpand(section.key)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-gray-900 text-sm">{section.label}</h4>
              <span className={`text-2xl font-bold px-3 py-1 rounded-lg ${getScoreColor(analysis[section.key].score)} bg-white`}>
                {analysis[section.key].score}
              </span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  analysis[section.key].score >= 80 ? 'bg-green-500' :
                  analysis[section.key].score >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${analysis[section.key].score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Title Analysis */}
      {analysis.title && (
        <div className="border-2 border-purple-200 rounded-lg overflow-hidden hover:border-purple-300 transition-colors duration-300">
          <div
            onClick={() => toggleExpand('title-detail')}
            className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 flex items-center justify-between cursor-pointer hover:from-purple-100 hover:to-purple-150 transition-colors duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">🏷️</div>
              <div>
                <h4 className="font-bold text-purple-900">Seiten-Titel Analyse</h4>
                <p className="text-sm text-purple-700">Aktuell: {analysis.title.current_title_length} zeichen</p>
              </div>
            </div>
            <div className={`transform transition-transform duration-300 ${expandedItems['title-detail'] ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </div>

          {expandedItems['title-detail'] && (
            <div className="p-6 bg-purple-50 space-y-4 animate-slide-down">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">📍 Aktueller Titel:</p>
                  <div className="bg-white border-2 border-purple-200 rounded p-3">
                    <p className="text-sm font-mono text-gray-900">{analysis.title.current_title}</p>
                    <p className="text-xs text-gray-600 mt-2">{analysis.title.current_title_length} / 60 Zeichen (Ideal: 50-60)</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">✨ Optimierter Titel:</p>
                  <div className="bg-green-50 border-2 border-green-300 rounded p-3 relative">
                    <p className="text-sm font-mono text-green-900">{analysis.title.optimized_title}</p>
                    <p className="text-xs text-green-700 mt-2">{analysis.title.optimized_title.length} / 60 Zeichen</p>
                    <button
                      onClick={() => handleCopy(analysis.title.optimized_title, 'title')}
                      className="absolute top-2 right-2 p-2 hover:bg-green-200 rounded transition-colors duration-300"
                    >
                      {copied === 'title' ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-gray-600" />}
                    </button>
                  </div>
                </div>
              </div>

              {analysis.title.issues && analysis.title.issues.length > 0 && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-400">
                  <h5 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                    <AlertCircle size={20} />
                    Erkannte Probleme
                  </h5>
                  <ul className="space-y-2">
                    {analysis.title.issues.map((issue, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-orange-800">
                        <span className="font-bold">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.title.recommendations && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
                  <h5 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Zap size={20} />
                    Empfehlungen
                  </h5>
                  <ul className="space-y-2">
                    {analysis.title.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-blue-800">
                        <span className="font-bold text-blue-600">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Meta Description Analysis */}
      {analysis.meta && (
        <div className="border-2 border-blue-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors duration-300">
          <div
            onClick={() => toggleExpand('meta-detail')}
            className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 flex items-center justify-between cursor-pointer hover:from-blue-100 hover:to-blue-150 transition-colors duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">📄</div>
              <div>
                <h4 className="font-bold text-blue-900">Meta-Description Analyse</h4>
                <p className="text-sm text-blue-700">Aktuell: {analysis.meta.current_meta_length} zeichen</p>
              </div>
            </div>
            <div className={`transform transition-transform duration-300 ${expandedItems['meta-detail'] ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </div>

          {expandedItems['meta-detail'] && (
            <div className="p-6 bg-blue-50 space-y-4 animate-slide-down">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">📍 Aktuelle Meta-Description:</p>
                  <div className="bg-white border-2 border-blue-200 rounded p-3">
                    <p className="text-sm font-mono text-gray-900">{analysis.meta.current_meta}</p>
                    <p className="text-xs text-gray-600 mt-2">{analysis.meta.current_meta_length} / 160 Zeichen (Ideal: 150-160)</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">✨ Optimierte Meta-Description:</p>
                  <div className="bg-green-50 border-2 border-green-300 rounded p-3 relative">
                    <p className="text-sm font-mono text-green-900">{analysis.meta.optimized_meta}</p>
                    <p className="text-xs text-green-700 mt-2">{analysis.meta.optimized_meta.length} / 160 Zeichen</p>
                    <button
                      onClick={() => handleCopy(analysis.meta.optimized_meta, 'meta')}
                      className="absolute top-2 right-2 p-2 hover:bg-green-200 rounded transition-colors duration-300"
                    >
                      {copied === 'meta' ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-gray-600" />}
                    </button>
                  </div>
                </div>
              </div>

              {analysis.meta.has_cta ? (
                <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400 flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-sm font-semibold text-green-800">✓ Call-to-Action vorhanden</span>
                </div>
              ) : (
                <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-400 flex items-center gap-2">
                  <AlertCircle className="text-orange-600" size={20} />
                  <span className="text-sm font-semibold text-orange-800">Call-to-Action fehlt</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content Analysis */}
      {analysis.content && (
        <div className="border-2 border-green-200 rounded-lg overflow-hidden hover:border-green-300 transition-colors duration-300">
          <div
            onClick={() => toggleExpand('content-detail')}
            className="bg-gradient-to-r from-green-50 to-green-100 p-5 flex items-center justify-between cursor-pointer hover:from-green-100 hover:to-green-150 transition-colors duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">📖</div>
              <div>
                <h4 className="font-bold text-green-900">Content Analyse</h4>
                <p className="text-sm text-green-700">{analysis.content.word_count} Wörter</p>
              </div>
            </div>
            <div className={`transform transition-transform duration-300 ${expandedItems['content-detail'] ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </div>

          {expandedItems['content-detail'] && (
            <div className="p-6 bg-green-50 space-y-4 animate-slide-down">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 text-center border-2 border-green-200">
                  <p className="text-xs text-gray-600 mb-1">WortAnzahl</p>
                  <p className="text-2xl font-bold text-green-600">{analysis.content.word_count}</p>
                  <p className="text-xs text-green-600">Ideal: 300-500</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border-2 border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">H1 Tags</p>
                  <p className="text-2xl font-bold text-blue-600">{analysis.content.h1_count || 0}</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border-2 border-purple-200">
                  <p className="text-xs text-gray-600 mb-1">H2 Tags</p>
                  <p className="text-2xl font-bold text-purple-600">{analysis.content.h2_count || 0}</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border-2 border-orange-200">
                  <p className="text-xs text-gray-600 mb-1">Listen</p>
                  <p className="text-2xl font-bold text-orange-600">{analysis.content.has_lists ? '✓' : '✗'}</p>
                </div>
              </div>

              {analysis.content.recommendations && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
                  <h5 className="font-bold text-blue-900 mb-3">Content Empfehlungen</h5>
                  <ul className="space-y-2">
                    {analysis.content.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-blue-800">
                        <span className="font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Recommendations Priority */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border-2 border-red-200">
          <h3 className="font-bold text-lg text-red-900 mb-4 flex items-center gap-2">
            <AlertCircle size={24} />
            Priorisierte Optimierungs-Roadmap
          </h3>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-4 border-l-4 ${getSeverityColor(rec.priority)} hover:shadow-md transition-all duration-300 animate-fade-in`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 mb-1">{rec.issue}</h5>
                    <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                    <p className="text-sm font-semibold text-gray-800">💡 Aktion: {rec.action}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2 ${
                    rec.priority === 'critical' ? 'bg-red-200 text-red-800' :
                    rec.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {rec.priority === 'critical' ? '🔴 KRITISCH' :
                     rec.priority === 'high' ? '🟠 HOCH' :
                     '🟡 MITTEL'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

export default SEOAnalysisReport;
