import { findAppGist, createGist, updateGist, readGist } from './githubGist';
import { storage } from './storage';
import { DATA_VERSION, SYNC_DEBOUNCE_MS } from './constants';

let syncTimeout = null;
let isSyncing = false;

// Get all app data as a single object
export function getAppData() {
  return {
    version: DATA_VERSION,
    lastModified: new Date().toISOString(),
    settings: storage.get('settings', {}),
    semesters: storage.get('semesters', []),
    courses: storage.get('courses', []),
    attendance: storage.get('attendance', []),
    scheduleNotes: storage.get('scheduleNotes', []),
  };
}

// Apply remote data to local storage
export function applyRemoteData(data) {
  if (data.settings) storage.set('settings', data.settings);
  if (data.semesters) storage.set('semesters', data.semesters);
  if (data.courses) storage.set('courses', data.courses);
  if (data.attendance) storage.set('attendance', data.attendance);
  if (data.scheduleNotes) storage.set('scheduleNotes', data.scheduleNotes);
  storage.set('lastSyncTime', new Date().toISOString());
}

// Sync: push local data to gist
export async function pushToGist(token, gistId) {
  const data = getAppData();
  await updateGist(token, gistId, data);
  storage.set('lastSyncTime', new Date().toISOString());
  return data;
}

// Sync: pull gist data to local
export async function pullFromGist(token, gistId) {
  const data = await readGist(token, gistId);
  applyRemoteData(data);
  return data;
}

// Full sync logic
export async function syncData(token, onStatusChange) {
  if (isSyncing) return;
  isSyncing = true;
  onStatusChange?.('syncing');

  try {
    let gistId = storage.get('gistId');

    // Find or create gist
    if (!gistId) {
      const existing = await findAppGist(token);
      if (existing) {
        gistId = existing.id;
        storage.set('gistId', gistId);
      } else {
        const newGist = await createGist(token, getAppData());
        gistId = newGist.id;
        storage.set('gistId', gistId);
        onStatusChange?.('synced');
        isSyncing = false;
        return;
      }
    }

    // Compare timestamps
    const localTime = storage.get('lastSyncTime');
    const remoteData = await readGist(token, gistId);
    const remoteTime = remoteData?.lastModified;

    if (remoteData && (!localTime || (remoteTime && new Date(remoteTime) > new Date(localTime)))) {
      // Remote is newer or this is a fresh device, pull
      applyRemoteData(remoteData);
    } else {
      // Local is newer or equal, push
      await pushToGist(token, gistId);
    }

    onStatusChange?.('synced');
  } catch (error) {
    console.error('Sync error:', error);
    onStatusChange?.('error');
    throw error;
  } finally {
    isSyncing = false;
  }
}

// Debounced sync: call after data changes
export function debouncedSync(token, onStatusChange) {
  if (syncTimeout) clearTimeout(syncTimeout);
  onStatusChange?.('pending');
  
  syncTimeout = setTimeout(() => {
    syncData(token, onStatusChange).catch(console.error);
  }, SYNC_DEBOUNCE_MS);
}

export function cancelPendingSync() {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }
}
