import { GIST_FILENAME, APP_NAME } from './constants';

const GITHUB_API = 'https://api.github.com';

async function fetchGitHub(endpoint, token, options = {}) {
  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `GitHub API error: ${response.status}`);
  }

  return response.json();
}

// Find existing app gist
export async function findAppGist(token) {
  const gists = await fetchGitHub('/gists?per_page=100', token);
  return gists.find(g => g.files && g.files[GIST_FILENAME]);
}

// Create new private gist
export async function createGist(token, data) {
  return fetchGitHub('/gists', token, {
    method: 'POST',
    body: JSON.stringify({
      description: `${APP_NAME} - Dữ liệu quản lý GPA (tự động đồng bộ)`,
      public: false,
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    }),
  });
}

// Update existing gist
export async function updateGist(token, gistId, data) {
  return fetchGitHub(`/gists/${gistId}`, token, {
    method: 'PATCH',
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    }),
  });
}

// Read gist data
export async function readGist(token, gistId) {
  const gist = await fetchGitHub(`/gists/${gistId}`, token);
  const file = gist.files?.[GIST_FILENAME];
  if (!file) throw new Error('Không tìm thấy dữ liệu trong Gist');
  return JSON.parse(file.content);
}

// Validate token
export async function validateToken(token) {
  try {
    const user = await fetchGitHub('/user', token);
    return { valid: true, username: user.login, avatar: user.avatar_url };
  } catch (e) {
    return { valid: false, error: e.message };
  }
}
