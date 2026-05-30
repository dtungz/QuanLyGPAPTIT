import { useState, useCallback, useEffect, useRef } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { syncData, debouncedSync, cancelPendingSync } from '../utils/syncEngine';
import { decryptData } from '../utils/crypto';
import { storage } from '../utils/storage';

export function useSync() {
  const isOnline = useOnlineStatus();
  const [syncStatus, setSyncStatus] = useState('disconnected');
  const [lastSyncTime, setLastSyncTime] = useState(storage.get('lastSyncTime'));
  const [error, setError] = useState(null);
  const tokenRef = useRef(null);

  // Get decrypted token
  const getToken = useCallback(() => {
    if (tokenRef.current) return tokenRef.current;
    const encryptedToken = storage.get('github-token');
    const passphrase = storage.get('passphrase-hash');
    if (!encryptedToken || !passphrase) return null;
    const token = decryptData(encryptedToken, passphrase);
    tokenRef.current = token;
    return token;
  }, []);

  const isConnected = useCallback(() => {
    return !!storage.get('github-token') && !!storage.get('gistId');
  }, []);

  // Manual sync
  const forceSync = useCallback(async () => {
    const token = getToken();
    if (!token || !isOnline) return;

    setError(null);
    try {
      await syncData(token, setSyncStatus);
      setLastSyncTime(new Date().toISOString());
    } catch (err) {
      setError(err.message);
      setSyncStatus('error');
    }
  }, [getToken, isOnline]);

  // Trigger sync after data change
  const triggerSync = useCallback(() => {
    const token = getToken();
    if (!token || !isOnline) return;
    debouncedSync(token, setSyncStatus);
  }, [getToken, isOnline]);

  // Auto sync on app load
  useEffect(() => {
    if (isOnline && isConnected()) {
      forceSync();
    }
    if (!isOnline) {
      setSyncStatus('offline');
    }
  }, [isOnline]);

  // Update status when going offline
  useEffect(() => {
    if (!isOnline) setSyncStatus('offline');
    else if (isConnected()) setSyncStatus('synced');
  }, [isOnline, isConnected]);

  // Cleanup
  useEffect(() => {
    return () => cancelPendingSync();
  }, []);

  return {
    syncStatus,
    lastSyncTime,
    error,
    isOnline,
    isConnected: isConnected(),
    forceSync,
    triggerSync,
  };
}
