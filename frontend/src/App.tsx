import React, { useState, useEffect } from "react";
import { api } from './client'
import { Heart, Users, Play, Search, User, Home, Settings, Calendar, Clock, MapPin, FileText } from "lucide-react";

const App = () => {
    const [activeTab, setActiveTab] = useState("feed");
    const [newPost, setNewPost] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    // Mock user profile data
    const [userProfile, setUserProfile] = useState({
        name: "John Doe",
        age: 42,
        location: "San Francisco, CA",
        bio: "Staying positive through my recovery journey. One day at a time!",
        condition: "Knee Replacement Surgery",
        diagnosisDate: "2023-10-15",
        hospital: "General Hospital SF",
        doctor: "Dr. Emily Chen",
        treatment: "Physical therapy 3x/week, pain management",
        medications: ["Ibuprofen", "Acetaminophen", "Vitamin D"],
        progress: "Week 6 of recovery - walking with cane",
        goals: "Return to hiking by summer 2024"
    });
    const handleSaveProfile = () => {
        setUserProfile(editForm);
        setIsEditing(false);
    };
    const [editForm, setEditForm] = useState(userProfile);
    const [posts, setPosts] = useState([
        {
            id: 1,
            user: "Sarah K.",
            condition: "Knee Surgery Recovery",
            content: "Today I managed to walk without crutches for the first time! So proud of this small victory in my recovery journey.",
            time: "2 hours ago",
            likes: 12,
            comments: 4,
        },
        {
            id: 2,
            user: "Michael T.",
            condition: "Multiple Sclerosis",
            content: "Finding new ways to manage fatigue has been challenging but rewarding. Meditation and light stretching have helped tremendously.",
            time: "5 hours ago",
            likes: 8,
            comments: 3,
        },
        {
            id: 3,
            user: "Jennifer L.",
            condition: "Cancer Remission",
            content: "Completed my final treatment session today! So grateful for this community's support through the tough days.",
            time: "1 day ago",
            likes: 24,
            comments: 10,
        },
    ]);
    const handleEditChange = (field: string, value: string | string[]) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const [connections, setConnections] = useState([
        {
            id: 1,
            name: "David R.",
            condition: "Knee Surgery Recovery",
            journey: "Week 3 of recovery",
            location: "New York, USA",
            status: "Similar journey",
        },
        {
            id: 2,
            name: "Emma W.",
            condition: "Multiple Sclerosis",
            journey: "Managing symptoms for 2 years",
            location: "London, UK",
            status: "Can offer advice",
        },
        {
            id: 3,
            name: "James P.",
            condition: "Cancer Remission",
            journey: "6 months post-treatment",
            location: "Toronto, Canada",
            status: "Support mentor",
        },
        {
            id: 4,
            name: "Lisa M.",
            condition: "Knee Surgery Recovery",
            journey: "Week 5 of recovery",
            location: "Sydney, Australia",
            status: "Similar journey",
        },
    ]);

    const [games] = useState([
        {
            id: 1,
            title: "Memory Match",
            description: "Improve cognitive function with this memory matching game",
            category: "Alzheimer's/Cognitive",
            difficulty: "Easy",
        },
        {
            id: 2,
            title: "Motion Therapy",
            description: "Gentle exercises for physical rehabilitation",
            category: "Physical Recovery",
            difficulty: "Adaptive",
        },
        {
            id: 3,
            title: "Word Puzzles",
            description: "Challenge your vocabulary and problem-solving skills",
            category: "Cognitive Therapy",
            difficulty: "Medium",
        },
        {
            id: 4,
            title: "Breathing Relaxation",
            description: "Guided breathing exercises for stress management",
            category: "Mental Wellness",
            difficulty: "All Levels",
        },
    ]);

    useEffect(() => {
        // fetch posts from backend; fallback to local posts if backend unavailable
        api.get('/posts')
            .then((docs: any[]) => {
                if (!Array.isArray(docs) || docs.length === 0) return
                const mapped = docs.map(d => ({
                    id: d._id,
                    user: d.author_id || 'Unknown',
                    condition: d.condition || '',
                    content: d.content,
                    time: d.created_at || '',
                    likes: d.likes || 0,
                    comments: d.comments || 0,
                }))
                setPosts(mapped)
            })
            .catch(() => {
                // keep local seeded posts
            })
    }, [])

    const handleAddPost = async () => {
        if (!newPost.trim()) return
        try {
            const created = await api.post('/posts', { author_id: 'demo-user', content: newPost, created_at: new Date().toISOString() })
            const mapped = {
                id: created._id,
                user: created.author_id || 'You',
                condition: created.condition || '',
                content: created.content,
                time: created.created_at || 'Just now',
                likes: created.likes || 0,
                comments: created.comments || 0,
            }
            setPosts([mapped, ...posts])
            setNewPost('')
        } catch (e) {
            // fallback to local add
            const newPostObj = {
                id: posts.length + 1,
                user: "You",
                condition: "Your Condition",
                content: newPost,
                time: "Just now",
                likes: 0,
                comments: 0,
            };
            setPosts([newPostObj, ...posts]);
            setNewPost("");
        }
    }

    const handleLikePost = async (id: any) => {
        // update backend then update UI
        try {
            await api.post(`/posts/${id}/like`, { user_id: 'demo-user' })
            setPosts(posts.map(post => (post.id === id ? { ...post, likes: (post.likes || 0) + 1 } : post)))
        } catch (e) {
            // optimistic fallback
            setPosts(posts.map(post => (post.id === id ? { ...post, likes: (post.likes || 0) + 1 } : post)))
        }
    };

    const handleConnect = (id: number) => {
        setConnections(connections.map(connection =>
            connection.id === id ? { ...connection, status: "Connected" } : connection
        ));
    };
    const addMedication = () => {
        setEditForm(prev => ({
            ...prev,
            medications: [...prev.medications, ""]
        }));
    };

    const updateMedication = (index: number, value: string) => {
        const updatedMeds = [...editForm.medications];
        updatedMeds[index] = value;
        setEditForm(prev => ({ ...prev, medications: updatedMeds }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm p-4">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">RecoveryTogether</h1>
                    <div className="flex items-center space-x-4">
                        <Search className="text-gray-500 cursor-pointer" size={20} />
                        <button
                            onClick={() => setActiveTab("profile")}
                            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                        >
                            <User size={20} />
                            <span>Profile</span>
                        </button>
                    </div>
                </div>
            </header>

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
                        <Play size={20} />
                        <span className="text-sm mt-1">Games</span>
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
                                        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                                            <span>💬</span>
                                            <span>{post.comments}</span>
                                        </button>
                                        <button className="flex items-center space-x-1 hover:text-green-600 transition-colors">
                                            <span>📤</span>
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Connect Page */}
                {activeTab === "connect" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Connect with Others</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {connections.map((connection) => (
                                <div key={connection.id} className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                            <User className="text-green-600" size={28} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{connection.name}</h3>
                                            <p className="text-gray-600">{connection.condition}</p>
                                            <p className="text-sm text-gray-500">{connection.location}</p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            {connection.journey}
                                        </span>
                                    </div>
                                    <p className="text-green-600 font-medium mb-4">{connection.status}</p>
                                    <button
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        onClick={() => handleConnect(connection.id)}
                                    >
                                        {connection.status === "Connected" ? "Message" : "Connect"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Games Page */}
                {activeTab === "games" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Therapeutic Games</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {games.map((game) => (
                                <div key={game.id} className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                        <img
                                            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ea9a6ac0-f3f7-4eb2-8823-7fae4477efcd.png"
                                            alt="Therapeutic game interface showing cognitive exercise elements"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-semibold text-lg mb-2">{game.title}</h3>
                                        <p className="text-gray-600 mb-4">{game.description}</p>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                                {game.category}
                                            </span>
                                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                                {game.difficulty}
                                            </span>
                                        </div>
                                        <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                                            Play Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Profile Page */}
                {activeTab === "profile" && (
                    <div className="bg-white rounded-lg shadow">
                        {/* Profile Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-lg text-white">
                            <div className="flex items-center space-x-6">
                                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <User size={48} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                                    <p className="text-blue-100">{userProfile.age} years • {userProfile.location}</p>
                                    <p className="mt-2">{userProfile.bio}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                            </button>
                        </div>

                        {/* Profile Content */}
                        <div className="p-6">
                            {!isEditing ? (
                                /* View Mode */
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Medical Information */}
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                                <FileText className="mr-2" size={20} />
                                                Medical Information
                                            </h2>
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="font-medium">Condition:</span> {userProfile.condition}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Diagnosed:</span> {userProfile.diagnosisDate}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Hospital:</span> {userProfile.hospital}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Doctor:</span> {userProfile.doctor}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Treatment Plan */}
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                                <Calendar className="mr-2" size={20} />
                                                Treatment Plan
                                            </h2>
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="font-medium">Treatment:</span> {userProfile.treatment}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Medications:</span>
                                                    <ul className="list-disc list-inside ml-4 mt-1">
                                                        {userProfile.medications.map((med, index) => (
                                                            <li key={index}>{med}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress & Goals */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                                <Clock className="mr-2" size={20} />
                                                Current Progress
                                            </h2>
                                            <p>{userProfile.progress}</p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                                <MapPin className="mr-2" size={20} />
                                                Recovery Goals
                                            </h2>
                                            <p>{userProfile.goals}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Edit Mode */
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => handleEditChange('name', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Age</label>
                                            <input
                                                type="number"
                                                value={editForm.age}
                                                onChange={(e) => handleEditChange('age', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Location</label>
                                        <input
                                            type="text"
                                            value={editForm.location}
                                            onChange={(e) => handleEditChange('location', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Bio</label>
                                        <textarea
                                            value={editForm.bio}
                                            onChange={(e) => handleEditChange('bio', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Medical Condition</label>
                                            <input
                                                type="text"
                                                value={editForm.condition}
                                                onChange={(e) => handleEditChange('condition', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Diagnosis Date</label>
                                            <input
                                                type="date"
                                                value={editForm.diagnosisDate}
                                                onChange={(e) => handleEditChange('diagnosisDate', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Hospital</label>
                                            <input
                                                type="text"
                                                value={editForm.hospital}
                                                onChange={(e) => handleEditChange('hospital', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Doctor</label>
                                            <input
                                                type="text"
                                                value={editForm.doctor}
                                                onChange={(e) => handleEditChange('doctor', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Treatment Plan</label>
                                        <textarea
                                            value={editForm.treatment}
                                            onChange={(e) => handleEditChange('treatment', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium">Medications</label>
                                            <button
                                                onClick={addMedication}
                                                className="text-blue-600 text-sm hover:text-blue-800"
                                            >
                                                + Add Medication
                                            </button>
                                        </div>
                                        {editForm.medications.map((med, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                value={med}
                                                onChange={(e) => updateMedication(index, e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg mb-2"
                                                placeholder="Medication name"
                                            />
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Current Progress</label>
                                            <textarea
                                                value={editForm.progress}
                                                onChange={(e) => handleEditChange('progress', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                                rows={2}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Recovery Goals</label>
                                            <textarea
                                                value={editForm.goals}
                                                onChange={(e) => handleEditChange('goals', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                                rows={2}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSaveProfile}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
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
                        className={`flex flex-col items-center py-3 px-6 ${activeTab === "profile" ? "text-blue-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab("profile")}
                    >
                        <User size={20} />
                        <span className="text-xs mt-1">Profile</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
