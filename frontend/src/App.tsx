import { useState, useEffect } from "react";
import { Heart, Users, Play, User, Home, Stethoscope, Bot } from "lucide-react";
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
    const [isEditing, setIsEditing] = useState(false);
    // AI Search modal state (moved inside component)
    const [aiSearchOpen, setAISearchOpen] = useState(false);
    const [aiQuery, setAIQuery] = useState("");
    const [aiResults, setAIResults] = useState<string[]>([]);
    const [aiMarkdown, setAIMarkdown] = useState<string>("");
    const [aiLoading, setAILoading] = useState(false);
    const aiSuggestions = [
        "Find doctors for knee pain",
        "What is physical therapy?",
        "Tips for post-surgery recovery",
        "How to manage chronic pain?"
    ];

    // Call backend AI endpoint (Gemini proxy)
    const handleAISearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const q = aiQuery.trim();
        if (!q) return;
        setAILoading(true);
    setAIResults([]);
    setAIMarkdown("");
        try {
            const res = await fetch('/api/ai/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: q })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'AI error');
            const text: string = data.text || '';
            setAIMarkdown(text);
            // Also keep lines for fallback, if needed
            const lines = text.split(/\n+/).filter(Boolean);
            setAIResults(lines);
        } catch (err: any) {
            setAIResults([`Error: ${err.message}`]);
        } finally {
            setAILoading(false);
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
                id: 2,
                user: 'Michael T.',
                condition: 'Multiple Sclerosis',
                content: 'Finding new ways to manage fatigue has been challenging.',
                time: '5 hours ago',
                likes: 8,
                comments: 3,
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
        if (!newPost.trim()) return
        const newPostObj = {
            id: posts.length + 1,
            user: "You",
            condition: userProfile.condition || 'Your Condition',
            content: newPost,
            time: "Just now",
            likes: 0,
            comments: 0,
        };
        setPosts([newPostObj, ...posts]);
        setNewPost("");
    }

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
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
                                    <button
                                        className="absolute top-2 right-2 text-gray-400 hover:text-blue-600"
                                        onClick={() => { setAISearchOpen(false); setAIQuery(""); setAIResults([]); }}
                                        aria-label="Close AI Search"
                                    >
                                        ×
                                    </button>
                                    <h3 className="text-xl font-bold mb-2 text-blue-700 flex items-center gap-2"><Bot size={20} />AI Health Search</h3>
                                    <form onSubmit={handleAISearch} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            className="flex-1 border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            placeholder="Ask a health question or search for help..."
                                            value={aiQuery}
                                            onChange={e => setAIQuery(e.target.value)}
                                            autoFocus
                                        />
                                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">Ask</button>
                                    </form>
                                    <div className="mb-2 text-gray-500 text-sm">Try:
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {aiSuggestions.map(s => (
                                                <button
                                                    key={s}
                                                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-100 border border-blue-100"
                                                    onClick={() => { setAIQuery(s); setAIResults([]); }}
                                                    type="button"
                                                >{s}</button>
                                            ))}
                                        </div>
                                    </div>
                                    {aiLoading && <div className="text-blue-600 mt-4">Thinking...</div>}
                                    {!aiLoading && aiMarkdown && (
                                        <div className="mt-4">
                                            <div className="font-semibold mb-2 text-gray-700">AI Results:</div>
                                            <div className="prose prose-blue max-w-none text-sm">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiMarkdown}</ReactMarkdown>
                                            </div>
                                        </div>
                                    )}
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
