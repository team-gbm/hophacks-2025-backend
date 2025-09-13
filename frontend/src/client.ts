const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

async function request(path: string, opts: RequestInit = {}) {
    const res = await fetch(BASE + path, {
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
}
