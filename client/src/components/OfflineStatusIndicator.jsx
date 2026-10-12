import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { offlineSync } from '../services/offlineSync';

export const OfflineStatusIndicator = () => {
  const [status, setStatus] = useState(offlineSync.getStatus());
  const [showQueueDetails, setShowQueueDetails] = useState(false);

  useEffect(() => {
    const unsubscribe = offlineSync.subscribe((newStatus) => {
      setStatus(newStatus);
    });
    return unsubscribe;
  }, []);

  const handleSyncClick = async (e) => {
    e.stopPropagation();
    await offlineSync.syncNow();
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setShowQueueDetails(!showQueueDetails)}
        className={`cursor-pointer px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold transition-all shadow-sm ${
          !status.isOnline 
            ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
            : status.pendingCount > 0
            ? 'bg-purple-100 text-purple-900 border border-purple-200'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
        }`}
        title={!status.isOnline ? 'Offline Mode active: Records are saved safely locally' : 'Sync Status'}
      >
        {!status.isOnline ? (
          <>
            <WifiOff className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Offline (Saved Locally)</span>
            <span className="bg-amber-200 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold">
              {status.pendingCount} Queued
            </span>
          </>
        ) : status.isSyncing ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-purple-600 animate-spin" />
            <span className="hidden sm:inline">Syncing with Server...</span>
          </>
        ) : status.pendingCount > 0 ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">{status.pendingCount} Pending Sync</span>
            <button
              onClick={handleSyncClick}
              className="px-2 py-0.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-[10px] ml-1"
            >
              Sync Now
            </button>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Online (All Synced)</span>
          </>
        )}
      </div>

      {/* Dropdown with pending sync details */}
      {showQueueDetails && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs space-y-3 animate-pop-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <p className="font-extrabold text-slate-800 font-heading">
              Offline Persistence Engine
            </p>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${status.isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {status.isOnline ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <p className="text-slate-500 text-[11px] leading-relaxed">
            KinderOffline guarantees zero data loss. Records created while disconnected are securely cached in local browser storage and synchronized idempotently upon connection return.
          </p>

          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {status.queue.length === 0 ? (
              <div className="p-3 rounded-xl bg-slate-50 text-center text-slate-400 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                All local records confirmed by server.
              </div>
            ) : (
              status.queue.map(item => (
                <div key={item.localId} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{item.label}</p>
                    <p className="text-[10px] text-slate-400">{new Date(item.clientTimestamp).toLocaleTimeString()}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">
                    Pending
                  </span>
                </div>
              ))
            )}
          </div>

          {status.queue.length > 0 && status.isOnline && (
            <button
              onClick={handleSyncClick}
              disabled={status.isSyncing}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 hover:opacity-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${status.isSyncing ? 'animate-spin' : ''}`} />
              {status.isSyncing ? 'Synchronizing...' : 'Force Sync Now'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
