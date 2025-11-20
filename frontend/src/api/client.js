const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export async function api(path, {method = 'GET', body, token} = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
        credentials: 'include', // optional, include for refresh cookies
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        if (data.message?.includes('expired')) {
            const newToken = await refreshAccessToken();
            if (!newToken) throw new Error("Session expired. Please log in again");
            return api(path, {method, body, token: newToken});
        }
        throw new Error(data.message || 'API request failed');
    }

    return data;
}


//refresh function
async function refreshAccessToken(){
    const res = await fetch(API_BASE + '/auth/refresh', {
        method: "POST",
        credentials: "include",
    });

    if(!res.ok) return null;

    const data = await res.json();
    localStorage.setItem('token', data.token);
    return data.token;
}