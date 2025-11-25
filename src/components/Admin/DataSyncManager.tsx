import { useState, useEffect, useCallback } from 'react';
import { useData } from '../../contexts/DataContext';
import { RefreshCw, Database, Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import type { BackendDataSummary } from '../../services/frontend-sync';

const DataSyncManager = () => {
  const { actions } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [backendData, setBackendData] = useState<BackendDataSummary | null>(null);
  const [message, setMessage] = useState('');

  const checkBackendData = useCallback(async () => {
    try {
      const data = await actions.checkBackendData();
      setBackendData(data);
    } catch (error) {
      console.error('Error checking backend data:', error);
    }
  }, [actions]);

  useEffect(() => {
    checkBackendData();
  }, [checkBackendData]);

  const handleSyncWithFrontend = async () => {
    setIsLoading(true);
    setSyncStatus('syncing');
    setMessage('');

    try {
      const result = await actions.syncWithFrontend();
      setSyncStatus('success');
      setMessage(result.message);
      await checkBackendData();
    } catch (error) {
      setSyncStatus('error');
      setMessage(error instanceof Error ? error.message : 'Sync failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToFrontend = async () => {
    if (!window.confirm('Are you sure you want to reset all backend data to frontend defaults? This will overwrite all existing data.')) {
      return;
    }

    setIsLoading(true);
    setSyncStatus('syncing');
    setMessage('');

    try {
      const result = await actions.resetToFrontend();
      setSyncStatus('success');
      setMessage(result.message);
      await checkBackendData();
    } catch (error) {
      setSyncStatus('error');
      setMessage(error instanceof Error ? error.message : 'Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Database className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Data Sync Manager
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage data synchronization between frontend and backend
        </p>
      </div>

      {/* Backend Data Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Backend Data Status
        </h2>
        
        {backendData ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{backendData.counts.projects}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{backendData.counts.profile}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Profile</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{backendData.counts.testimonials}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Testimonials</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{backendData.counts.youtube}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">YouTube Videos</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Loading backend data status...</p>
          </div>
        )}
      </div>

      {/* Sync Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Sync Actions
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Sync with Frontend</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sync frontend data to backend (updates existing records)
              </p>
            </div>
            <button
              onClick={handleSyncWithFrontend}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Sync Now
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Reset to Frontend Defaults</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Replace all backend data with frontend defaults (destructive)
              </p>
            </div>
            <button
              onClick={handleResetToFrontend}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
          <div className="flex items-center">
            {getStatusIcon()}
            <span className="ml-2 text-sm font-medium">{message}</span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          How it works:
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• <strong>Sync with Frontend:</strong> Updates backend with frontend data, preserving any custom changes</li>
          <li>• <strong>Reset to Frontend Defaults:</strong> Completely replaces backend data with frontend defaults</li>
          <li>• Frontend data is the source of truth for the initial portfolio content</li>
          <li>• All changes are immediately reflected in the frontend after sync</li>
        </ul>
      </div>
    </div>
  );
};

export default DataSyncManager;
