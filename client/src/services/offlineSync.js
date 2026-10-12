import { api } from './api';

const QUEUE_STORAGE_KEY = 'kinderhub_offline_queue';

class OfflineSyncManager {
  constructor() {
    this.queue = this.loadQueue();
    this.listeners = new Set();
    this.isSyncing = false;
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.notifyListeners();
        this.syncNow();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.notifyListeners();
      });
    }
  }

  loadQueue() {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(QUEUE_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Failed to read offline queue from localStorage:', e);
      return [];
    }
  }

  saveQueue() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      console.warn('Failed to save offline queue to localStorage:', e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(fn => fn({
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingCount: this.queue.length,
      queue: this.queue
    }));
  }

  // Queue a teacher operation locally when offline or for guaranteed delivery
  enqueue(type, payload, label = '') {
    const item = {
      localId: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type, // 'attendance' | 'observation' | 'daily_log'
      payload,
      label: label || `${type.toUpperCase()} Record`,
      clientTimestamp: new Date().toISOString(),
      status: 'pending_local'
    };

    this.queue.push(item);
    this.saveQueue();
    this.notifyListeners();

    // If online, try syncing immediately
    if (this.isOnline) {
      this.syncNow();
    }

    return item;
  }

  // Trigger synchronization of all queued items
  async syncNow() {
    if (this.isSyncing || this.queue.length === 0 || !this.isOnline) {
      return { syncedCount: 0, queueLength: this.queue.length };
    }

    try {
      this.isSyncing = true;
      this.notifyListeners();

      const response = await api.syncOfflineQueue(this.queue);

      if (response && response.results) {
        const confirmedLocalIds = new Set(
          response.results
            .filter(r => r.status.startsWith('confirmed') || r.status.startsWith('conflict_resolved'))
            .map(r => r.localId)
        );

        // Keep only unresolved/errored items
        this.queue = this.queue.filter(item => !confirmedLocalIds.has(item.localId));
        this.saveQueue();
      }

      return response;
    } catch (err) {
      console.error('Offline sync failed, keeping items in queue:', err);
      return { error: err.message, queueLength: this.queue.length };
    } finally {
      this.isSyncing = false;
      this.notifyListeners();
    }
  }

  getStatus() {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingCount: this.queue.length,
      queue: this.queue
    };
  }

  clearQueue() {
    this.queue = [];
    this.saveQueue();
    this.notifyListeners();
  }
}

export const offlineSync = new OfflineSyncManager();
