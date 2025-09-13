// Use the configured VITE_API_BASE when provided. During dev, prefer the Vite proxy
// by using a relative base (''), which avoids CORS issues and ensures requests
// go through the dev server at /api.
const DEV = Boolean(import.meta.env.DEV)
const BASE = import.meta.env.VITE_API_BASE ?? (DEV ? '' : 'http://localhost:5000/api')

async function request(path: string, opts: RequestInit = {}) {
    const url = BASE + path
    // small debug log to make it easy to see where requests go
    console.log('[api] request]', opts.method || 'GET', url)
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...opts,
        body: opts.body ? JSON.stringify(opts.body) : undefined,
    })
    if (!res.ok) {
        try {
            const err = await res.json()
            throw err
        } catch (e) {
            throw new Error('Request failed')
        }
    }
    try {
        return await res.json()
    } catch (e) {
        return null
    }
}

export const api = {
    get: (p: string) => request(p, { method: 'GET' }),
    post: (p: string, body?: any) => request(p, { method: 'POST', body }),
    put: (p: string, body?: any) => request(p, { method: 'PUT', body }),
}
