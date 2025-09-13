import React, { useEffect, useState } from 'react'
import { api } from './client'

type Post = {
    _id?: string
    author_id?: string
    content?: string
}

export default function App() {
    const [status, setStatus] = useState('')
    const [posts, setPosts] = useState<Post[]>([])
    const [content, setContent] = useState('')

    useEffect(() => {
        api.get('/health').then(r => setStatus(r.status))
        // fetch some posts (not paginated) -- demo only
        api.get('/posts').then(r => setPosts(r || []))
    }, [])

    async function createPost(e: React.FormEvent) {
        e.preventDefault()
        const res = await api.post('/posts', { author_id: 'demo-user', content })
        setPosts([res, ...posts])
        setContent('')
    }

    return (
        <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
            <h1>Hophacks — Community</h1>
            <div>Status: {status}</div>

            <section style={{ marginTop: 20 }}>
                <h2>Create post</h2>
                <form onSubmit={createPost}>
                    <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Share something" rows={4} style={{ width: '100%' }} />
                    <button type="submit">Post</button>
                </form>
            </section>

            <section style={{ marginTop: 20 }}>
                <h2>Feed</h2>
                {posts.length === 0 && <div>No posts yet</div>}
                <ul>
                    {posts.map(p => (
                        <li key={p._id} style={{ borderBottom: '1px solid #eee', padding: 8 }}>
                            <div>{p.content}</div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}
