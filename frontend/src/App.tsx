import { useState, useEffect } from "react";
import { Heart, Users, Play, User, Home, Stethoscope, Bot, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Profile from './components/Profile'
import Games from './components/Games';
import Connect, { mockSuggested } from './components/Connect';
import MedicalEducation from './components/MedicalEducation';
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

const App = () => {
    const [activeTab, setActiveTab] = useState("feed");
    const [newPost, setNewPost] = useState("");
    const [newMediaFiles, setNewMediaFiles] = useState<File[]>([]);
    const [newMediaPreviews, setNewMediaPreviews] = useState<{ type: 'image' | 'video'; src: string; name: string }[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    // AI Search modal state (moved inside component)
    const [aiSearchOpen, setAISearchOpen] = useState(false);
    const [aiQuery, setAIQuery] = useState("");
    const [aiResults, setAIResults] = useState<string[]>([]);
    const [aiMarkdown, setAIMarkdown] = useState<string>("");
    const [aiLoading, setAILoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const [chatFiles, setChatFiles] = useState<File[]>([]);
    const aiSuggestions = [
        "Find doctors for knee pain",
        "What is physical therapy?",
        "Tips for post-surgery recovery",
        "How to manage chronic pain?"
    ];

    // Call backend AI endpoint (Gemini proxy) - multi-turn chat with optional media
    const handleAISearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const q = aiQuery.trim();
        if (!q && chatFiles.length === 0) return;
        setAILoading(true);
        setAIResults([]);
        setAIMarkdown("");

        const newMessages: { role: 'user' | 'assistant'; content: string }[] = [...chatMessages, { role: 'user', content: q || (chatFiles.length ? '(sent media)' : '') }];
        setChatMessages(newMessages);

        try {
            let data: any;
            if (chatFiles.length > 0) {
                const form = new FormData();
                form.append('message', q);
                form.append('history', JSON.stringify(newMessages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', content: m.content }))));
                chatFiles.forEach(f => form.append('files', f));
                const res = await fetch('/api/ai/chat', { method: 'POST', body: form });
                data = await res.json();
                if (!res.ok) throw new Error(data.error || 'AI error');
            } else {
                const res = await fetch('/api/ai/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: q, messages: newMessages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', content: m.content })) })
                });
                data = await res.json();
                if (!res.ok) throw new Error(data.error || 'AI error');
            }

            const text: string = data.text || '';
            setAIMarkdown(text);
            setChatMessages(prev => [...prev, { role: 'assistant', content: text }]);

            const lines = text.split(/\n+/).filter(Boolean);
            setAIResults(lines);
        } catch (err: any) {
            setAIResults([`Error: ${err.message}`]);
            setChatMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
        } finally {
            setAILoading(false);
            setAIQuery("");
            setChatFiles([]);
        }
    };
    const mock = {
        profile: {
            name: 'John Doe',
            age: 42,
            location: 'San Francisco, CA',
            bio: 'Staying positive through my recovery journey. One day at a time!',
            condition: 'Knee Replacement Surgery',
            diagnosisDate: '2023-10-15',
            hospital: 'General Hospital SF',
            doctor: 'Dr. Emily Chen',
            treatment: 'Physical therapy 3x/week, pain management',
            medications: ['Ibuprofen', 'Acetaminophen', 'Vitamin D'],
            progress: 'Week 6 of recovery - walking with cane',
            goals: 'Return to hiking by summer 2024'
        },
        posts: [
            {
                id: 1,
                user: 'Sarah K.',
                condition: 'Knee Surgery Recovery',
                content: "Today I managed to walk without crutches for the first time!",
                time: '2 hours ago',
                likes: 12,
                comments: 4,
                media: [
                    { type: 'image', src: '/rehab.svg', alt: 'Rehab progress' }
                ],
                commentData: [
                    {
                        id: 1,
                        user: 'David R.',
                        content: 'That\'s amazing progress! Keep it up!',
                        time: '1 hour ago',
                        role: 'Knee Surgery Survivor',
                        condition: 'Knee Replacement',
                        isMedicalProfessional: false
                    },
                    {
                        id: 2,
                        user: 'Dr. Emma W.',
                        content: 'So proud of you! I remember that feeling.',
                        time: '45 minutes ago',
                        role: 'Physical Therapist',
                        condition: 'Medical Professional',
                        isMedicalProfessional: true
                    },
                    {
                        id: 3,
                        user: 'John M.',
                        content: 'Congratulations! You\'re an inspiration.',
                        time: '30 minutes ago',
                        role: 'Mobility Rehab Specialist',
                        condition: 'ACL Reconstruction',
                        isMedicalProfessional: true
                    },
                    {
                        id: 4,
                        user: 'Lisa P.',
                        content: 'This gives me hope for my recovery too!',
                        time: '15 minutes ago',
                        role: 'Knee Surgery Operation',
                        condition: 'Meniscus Repair',
                        isMedicalProfessional: false
                    }
                ]
            },
            {
                id: 3,
                user: 'Priya N.',
                condition: 'Cardiac Device Check',
                content: 'Device check day! Everything looks stable and battery life is good.',
                time: '1 day ago',
                likes: 21,
                comments: 5,
                media: [
                    { type: 'image', src: '/pacemaker.svg', alt: 'Pacemaker device illustration' }
                ],
                commentData: [
                    { id: 1, user: 'Alex P.', content: 'Great news—keep it up!', time: '23h ago', role: 'Supporter', condition: '—', isMedicalProfessional: false },
                    { id: 2, user: 'Dr. Emma W.', content: 'See you at the next routine follow-up.', time: '20h ago', role: 'Cardiologist', condition: 'Medical Professional', isMedicalProfessional: true },
                ]
            },
            {
                id: 4,
                user: 'Leo G.',
                condition: 'Physio Routine',
                content: 'Short step exercise video from today’s session—slow and steady.',
                time: '2 days ago',
                likes: 34,
                comments: 9,
                media: [
                    { type: 'video', src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', alt: 'Short exercise clip' },
                    { type: 'image', src: '/rehab.svg', alt: 'Rehab routine overview' }
                ],
                commentData: [
                    { id: 1, user: 'Sam R.', content: 'Nice form—keep breathing evenly!', time: '1d ago', role: 'Physical Therapist', condition: 'Medical Professional', isMedicalProfessional: true },
                ]
            },
            {
                id: 2,
                user: 'Michael T.',
                condition: 'Multiple Sclerosis',
                content: 'Finding new ways to manage fatigue has been challenging.',
                time: '5 hours ago',
                likes: 8,
                comments: 3,
                media: [
                    { type: 'image', src: '/bandage.svg', alt: 'Care supplies' }
                ],
                commentData: [
                    {
                        id: 1,
                        user: 'Sarah K.',
                        content: 'I understand completely. Have you tried meditation?',
                        time: '4 hours ago',
                        role: 'MS Survivor',
                        condition: 'Multiple Sclerosis',
                        isMedicalProfessional: false
                    },
                    {
                        id: 2,
                        user: 'Dr. Alex T.',
                        content: 'Pacing yourself is key. Don\'t be too hard on yourself.',
                        time: '3 hours ago',
                        role: 'Neurologist',
                        condition: 'Medical Professional',
                        isMedicalProfessional: true
                    },
                    {
                        id: 3,
                        user: 'Maria L.',
                        content: 'Sending you strength and support!',
                        time: '2 hours ago',
                        role: 'MS Transplant Patient',
                        condition: 'Multiple Sclerosis',
                        isMedicalProfessional: false
                    }
                ]
            }
    ],
        connections: [
            { id: 1, name: 'David R.', condition: 'Knee Surgery Recovery', journey: 'Week 3 of recovery', location: 'New York, USA', status: 'Similar journey' },
            { id: 2, name: 'Emma W.', condition: 'Multiple Sclerosis', journey: 'Managing symptoms for 2 years', location: 'London, UK', status: 'Can offer advice' }
        ],
        games: [
            { id: 1, title: 'Memory Match', description: 'Improve cognitive function with this memory matching game', category: "Cognitive", difficulty: 'Easy' },
            { id: 2, title: 'Motion Therapy', description: 'Gentle exercises for physical rehabilitation', category: 'Physical', difficulty: 'Adaptive' }
        ]
    }

    const [userProfile, setUserProfile] = useState<any>(mock.profile);
    const handleSaveProfile = (p: any) => {
        setUserProfile(p);
        setIsEditing(false);
    };
    const [editForm, setEditForm] = useState(userProfile);
    const [posts, setPosts] = useState<any[]>([])
    // editing is handled in Profile component; keep editForm state for two-way binding

    const [connections, setConnections] = useState<any[]>([])
    // Track connected suggested users by their IDs
    const [connectedSuggestedIds, setConnectedSuggestedIds] = useState<number[]>([]);
    // Store all suggested users (for lookup by id)
    const [allSuggested, setAllSuggested] = useState<any[]>([]);
    // Track which posts have comments expanded
    const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

    useEffect(() => {
        // Initialize with mock data
        setPosts(mock.posts)
        setUserProfile(mock.profile)
        setEditForm(mock.profile)
        setConnections(mock.connections)
        setAllSuggested(mockSuggested);
    }, [])

    const handleAddPost = async () => {
        if (!newPost.trim() && newMediaPreviews.length === 0) return
        const newPostObj = {
            id: posts.length + 1,
            user: "You",
            condition: userProfile.condition || 'Your Condition',
            content: newPost,
            time: "Just now",
            likes: 0,
            comments: 0,
            media: newMediaPreviews,
        };
        setPosts([newPostObj, ...posts]);
        setNewPost("");
        // Revoke object URLs and clear
        newMediaPreviews.forEach(p => URL.revokeObjectURL(p.src));
        setNewMediaFiles([]);
        setNewMediaPreviews([]);
    }

    const handleSelectMedia = (files: FileList | null) => {
        if (!files) return;
        const allowed = ['image/png','image/jpeg','image/webp','image/gif','video/mp4','video/webm','video/ogg'];
        const maxFiles = 6;
        const maxSize = 15 * 1024 * 1024; // 15MB per file
        const next: { type: 'image' | 'video'; src: string; name: string }[] = [];
        const nextFiles: File[] = [];
        for (const f of Array.from(files)) {
            if (!allowed.includes(f.type) || f.size > maxSize) continue;
            const isVideo = f.type.startsWith('video/');
            const url = URL.createObjectURL(f);
            next.push({ type: isVideo ? 'video' : 'image', src: url, name: f.name });
            nextFiles.push(f);
            if (newMediaPreviews.length + next.length >= maxFiles) break;
        }
        setNewMediaFiles(prev => [...prev, ...nextFiles].slice(0, maxFiles));
        setNewMediaPreviews(prev => [...prev, ...next].slice(0, maxFiles));
    };

    const handleRemovePreview = (idx: number) => {
        setNewMediaPreviews(prev => {
            const copy = [...prev];
            const [removed] = copy.splice(idx, 1);
            if (removed) URL.revokeObjectURL(removed.src);
            return copy;
        });
        setNewMediaFiles(prev => {
            const copy = [...prev];
            copy.splice(idx, 1);
            return copy;
        });
    };

    const handleLikePost = async (id: any) => {
        // update backend then update UI
        // optimistic local update
        setPosts(posts.map(post => (post.id === id ? { ...post, likes: (post.likes || 0) + 1 } : post)))
    };

    const toggleComments = (postId: number) => {
        setExpandedComments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };

    const handleConnect = (id: number) => {
        setConnections(connections.map(connection =>
            connection.id === id ? { ...connection, status: "Connected" } : connection
        ));
    };
    // Handle connect for suggested users (AI recommendations)
    const handleConnectSuggested = (userId: number) => {
        if (!connectedSuggestedIds.includes(userId)) {
            setConnectedSuggestedIds([...connectedSuggestedIds, userId]);
        }
    };
    // medication editing is handled in Profile if needed; helpers removed to avoid lint warnings
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-b-2xl py-6 px-4 mb-4">
                <div className="max-w-4xl mx-auto flex justify-between items-center cursor-pointer" >
                    <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight drop-shadow-sm" onClick={() => navigate('/')}>
                        LifeLine
                    </h1>
                    <div className="flex items-center space-x-6">
                        <h2 className="text-lg font-medium text-gray-700">
                            Welcome, <span className="font-semibold text-blue-600">{userProfile.name.split(' ')[0]}</span>!
                        </h2>
                        <button
                            className="transition-colors"
                            aria-label="AI Health Search"
                            onClick={() => setAISearchOpen(true)}
                        >
                            <Bot className="text-blue-500" size={24} />
                        </button>
                        {/* AI Search Modal */}
                        {aiSearchOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xl relative">
                                    <button
                                        className="absolute top-2 right-2 text-gray-400 hover:text-blue-600"
                                        onClick={() => { setAISearchOpen(false); setAIQuery(""); setAIResults([]); setChatMessages([]); setChatFiles([]); setAIMarkdown(""); }}
                                        aria-label="Close AI Search"
                                    >
                                        ×
                                    </button>
                                    <h3 className="text-xl font-bold mb-3 text-blue-700 flex items-center gap-2"><Bot size={20} />LifeLine AI Assistant</h3>
                                    <div className="flex flex-col gap-3">
                                        {/* Chat transcript */}
                                        <div className="border rounded-md p-3 h-72 overflow-y-auto bg-gray-50">
                                            {chatMessages.length === 0 && (
                                                <div className="text-sm text-gray-500">Ask a health question, share symptoms, or upload equipment images (e.g., pacemaker, glucometer, brace) for guidance.</div>
                                            )}
                                            <div className="space-y-3">
                                                {chatMessages.map((m, i) => (
                                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[80%] rounded-lg p-2 text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                                                            {m.role === 'assistant' ? (
                                                                <div className="prose prose-blue max-w-none">
                                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                                                                </div>
                                                            ) : (
                                                                <div>{m.content}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                {aiLoading && <div className="text-blue-600 text-sm">Thinking…</div>}
                                            </div>
                                        </div>

                                        {/* Input row */}
                                        <form onSubmit={handleAISearch} className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                className="flex-1 border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                placeholder="Type your question…"
                                                value={aiQuery}
                                                onChange={e => setAIQuery(e.target.value)}
                                            />
                                            <label className="cursor-pointer inline-flex items-center gap-1 text-blue-700 text-sm">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    multiple
                                                    onChange={e => setChatFiles(e.target.files ? Array.from(e.target.files) : [])}
                                                />
                                                <ImageIcon size={18} /> Media
                                            </label>
                                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700" disabled={aiLoading}>
                                                Send
                                            </button>
                                        </form>
                                        {/* Selected files preview */}
                                        {chatFiles.length > 0 && (
                                            <div className="text-xs text-gray-600">Selected: {chatFiles.map(f => f.name).join(', ')}</div>
                                        )}

                                        {/* Suggestions */}
                                        <div className="mb-1 text-gray-500 text-sm">Try:
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {aiSuggestions.map(s => (
                                                    <button
                                                        key={s}
                                                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-100 border border-blue-100"
                                                        onClick={() => { setAIQuery(s); }}
                                                        type="button"
                                                    >{s}</button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Latest assistant response in Markdown (optional) */}
                                        {!aiLoading && aiMarkdown && (
                                            <div className="mt-1">
                                                <div className="font-semibold mb-1 text-gray-700">Latest Answer</div>
                                                <div className="prose prose-blue max-w-none text-sm">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiMarkdown}</ReactMarkdown>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setActiveTab("profile")}
                            className="flex items-center space-x-2 text-gray-600 hover:text-blue-700 font-semibold"
                        >
                            <User size={20} />
                            <span>Profile</span>
                        </button>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <span className="text-base italic font-medium tracking-wide">
                        A Patient for a Patient
                    </span>
                </div>
                <div className="max-w-4xl mx-auto mt-4">
                    <hr className="border-t border-blue-100" />
                </div>
            </header>
            {/* ...rest of your content... */}

            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex justify-around">
                    <button
                        className={`flex flex-col items-center py-3 px-6 ${activeTab === "feed" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab("feed")}
                    >
                        <Home size={20} />
                        <span className="text-sm mt-1">Feed</span>
                    </button>
                    <button
                        className={`flex flex-col items-center py-3 px-6 ${activeTab === "connect" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab("connect")}
                    >
                        <Users size={20} />
                        <span className="text-sm mt-1">Connect</span>
                    </button>
                    <button
                        className={`flex flex-col items-center py-3 px-6 ${activeTab === "games" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab("games")}
                    >
                        <Stethoscope size={20} />
                        <span className="text-sm mt-1">Heal</span>
                    </button>
                    <button
                        className={`flex flex-col items-center py-3 px-6 ${activeTab === "medical" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab("medical")}
                    >
                        <Stethoscope size={20} />
                        <span className="text-sm mt-1">Medical Info</span>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto p-4 pb-20">
                {/* Feed Page */}
                {activeTab === "feed" && (
                    <div>
                        {/* Create Post */}
                        <div className="bg-white rounded-lg shadow p-4 mb-6">
                            <h2 className="text-lg font-semibold mb-3">Share your journey</h2>
                            <textarea
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="What's on your mind today?"
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                            />
                            {/* New post media attachments */}
                            <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                                <label className="text-blue-700 text-sm cursor-pointer inline-flex items-center gap-2">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,video/ogg"
                                        multiple
                                        onChange={(e) => handleSelectMedia(e.target.files)}
                                    />
                                    <span className="px-3 py-2 border border-blue-200 rounded hover:bg-blue-50">Add photos/videos</span>
                                </label>
                                {newMediaPreviews.length > 0 && (
                                    <div className="text-xs text-gray-600">{newMediaPreviews.length} selected</div>
                                )}
                            </div>
                            {newMediaPreviews.length > 0 && (
                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {newMediaPreviews.map((m, idx) => (
                                        <div key={idx} className="relative overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                                            {m.type === 'image' ? (
                                                <img src={m.src} alt={m.name} className="w-full h-32 object-cover" />
                                            ) : (
                                                <video src={m.src} className="w-full h-32 object-cover" muted controls={false} />
                                            )}
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 bg-white/90 rounded px-2 py-0.5 text-xs text-gray-700 hover:bg-white"
                                                onClick={() => handleRemovePreview(idx)}
                                                aria-label="Remove media"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex justify-end mt-3">
                                <button
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    onClick={handleAddPost}
                                >
                                    Post
                                </button>
                            </div>
                        </div>

                        {/* Posts Feed */}
                        <div className="space-y-6">
                            {posts.map((post) => (
                                <div key={post.id} className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <User className="text-blue-600" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{post.user}</h3>
                                            <p className="text-sm text-gray-500">{post.condition} • {post.time}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-4">{post.content}</p>
                                    {/* Media gallery */}
                                    {post.media && post.media.length > 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                            {post.media.map((m: any, idx: number) => (
                                                <div key={idx} className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                                                    {m.type === 'image' && (
                                                        <img src={m.src} alt={m.alt || 'media'} className="w-full h-48 object-cover" />
                                                    )}
                                                    {m.type === 'video' && (
                                                        <video src={m.src} controls className="w-full h-48 object-cover" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-6 text-gray-500">
                                        <button
                                            className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                                            onClick={() => handleLikePost(post.id)}
                                        >
                                            <Heart size={18} />
                                            <span>{post.likes}</span>
                                        </button>
                                        <button
                                            className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                                            onClick={() => toggleComments(post.id)}
                                        >
                                            <span>💬</span>
                                            <span>{post.comments}</span>
                                        </button>
                                        <button className="flex items-center space-x-1 hover:text-green-600 transition-colors">
                                            <span>📤</span>
                                            <span>Share</span>
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    {expandedComments.has(post.id) && post.commentData && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Comments</h4>
                                            <div className="space-y-3">
                                                {post.commentData.map((comment: any) => (
                                                    <div key={comment.id} className="flex items-start space-x-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${comment.isMedicalProfessional
                                                            ? 'bg-green-100'
                                                            : 'bg-gray-100'
                                                            }`}>
                                                            <User className={`size={16} ${comment.isMedicalProfessional
                                                                ? 'text-green-600'
                                                                : 'text-gray-500'
                                                                }`} size={16} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <span className={`text-sm font-medium ${comment.isMedicalProfessional
                                                                    ? 'text-green-700'
                                                                    : 'text-gray-900'
                                                                    }`}>
                                                                    {comment.user}
                                                                </span>
                                                                <span className={`text-xs px-2 py-1 rounded-full ${comment.isMedicalProfessional
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-blue-100 text-blue-700'
                                                                    }`}>
                                                                    {comment.role}
                                                                </span>
                                                                <span className="text-xs text-gray-500">•</span>
                                                                <span className="text-xs text-gray-500">{comment.time}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 mb-1">{comment.condition}</p>
                                                            <p className="text-sm text-gray-700">{comment.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Connect Page */}
                {activeTab === "connect" && (
                    <Connect
                        connections={connections}
                        setConnections={setConnections}
                        handleConnect={handleConnect}
                        connectedSuggestedIds={connectedSuggestedIds}
                        handleConnectSuggested={handleConnectSuggested}
                    />
                )}

                {/* Games Page */}
                {activeTab === "games" && <Games />}

                {/* Medical Education Page */}
                {activeTab === "medical" && <MedicalEducation />}

                {/* Profile Page */}
                {activeTab === "profile" && (
                    <Profile
                        profile={userProfile}
                        isEditing={isEditing}
                        editForm={editForm}
                        setEditForm={setEditForm}
                        onToggleEdit={() => setIsEditing(!isEditing)}
                        onLocalSave={handleSaveProfile}
                        connections={connections.filter(c => c.status === 'Connected')}
                        connectedSuggested={allSuggested.filter(u => connectedSuggestedIds.includes(u.id))}
                    />
                )}
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                <div className="flex justify-around">
                    <button
                        className={`flex flex-col items-center py-3 px-6 ${activeTab === "feed" ? "text-blue-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab("feed")}
                    >
                        <Home size={20} />
                        <span className="text-xs mt-1">Feed</span>
                    </button>
                    <button
                        className={`flex flex-col items-center py-3 px-6 ${activeTab === "connect" ? "text-blue-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab("connect")}
                    >
                        <Users size={20} />
                        <span className="text-xs mt-1">Connect</span>
                    </button>
                    <button
                        className={`flex flex-col items-center py-3 px-6 ${activeTab === "games" ? "text-blue-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab("games")}
                    >
                        <Play size={20} />
                        <span className="text-xs mt-1">Games</span>
                    </button>
                    <button
                        className={`flex flex-col items-center py-3 px-6 ${activeTab === "medical" ? "text-blue-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab("medical")}
                    >
                        <Stethoscope size={20} />
                        <span className="text-xs mt-1">Medical</span>
                    </button>
                    <button
                        className={`flex flex-col items-center py-3 px-6 ${activeTab === "profile" ? "text-blue-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab("profile")}
                    >
                        <User size={20} />
                        <span className="text-xs mt-1">Profile</span>
                    </button>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default App;
