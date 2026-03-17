import React from 'react';
import { AlertTriangle, AlertCircle, AlertOctagon, Zap } from 'lucide-react';

export const ErrorDiagnosisReport = ({ diagnosis, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!diagnosis) {
    return null;
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertOctagon className="text-red-600" size={20} />;
      case 'high':
        return <AlertTriangle className="text-orange-600" size={20} />;
      case 'medium':
        return <AlertCircle className="text-yellow-600" size={20} />;
      default:
        return <Zap className="text-blue-600" size={20} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const issues = diagnosis.diagnosed_issues || {};
  const actionPlan = diagnosis.action_plan || [];
  const quickWins = diagnosis.quick_wins || [];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold mb-4">Diagnose Zusammenfassung</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(issues).map(([severity, items]) => (
            <div key={severity} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{items.length}</div>
              <p className="text-sm text-gray-600 capitalize">{severity} Issues</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Wins */}
      {quickWins.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
            <Zap size={24} />
            Quick Wins für diese Woche
          </h3>
          <div className="space-y-3">
            {quickWins.map((win, idx) => (
              <div key={idx} className="bg-white rounded p-3 border border-green-100">
                <div className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{win.issue}</p>
                    <p className="text-sm text-gray-600 mt-1">{win.fix}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{win.effort}</span>
                      <span className="text-xs text-green-700 font-medium">{win.count} items</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Plan */}
      {actionPlan.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Priorisierter Aktionsplan</h3>
          {actionPlan.map((phase, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-gray-900">{phase.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{phase.issues.length} Aufgaben</p>
                </div>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Phase {phase.phase}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                {phase.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{issue.issue}</p>
                      <p className="text-xs text-gray-600">{issue.fix}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded p-3 border border-green-200">
                <p className="text-sm font-medium text-gray-900">
                  💡 <strong>Erwartet:</strong> {phase.expected_impact}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Issues by Severity */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Alle erkannten Probleme</h3>
        {Object.entries(issues).map(([severity, items]) => items.length > 0 && (
          <div key={severity} className={`rounded-lg p-6 border ${getSeverityColor(severity)}`}>
            <h4 className="font-bold mb-3 flex items-center gap-2 capitalize">
              {getSeverityIcon(severity)}
              {severity} Priorität ({items.length})
            </h4>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="bg-white rounded p-3 opacity-90">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.issue}</p>
                      <p className="text-xs text-gray-600 mt-1">{item.impact}</p>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorDiagnosisReport;
