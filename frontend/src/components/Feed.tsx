import React, { useState, useEffect } from "react";
import { Heart, User } from "lucide-react";

interface Post {
  id: number;
  user: string;
  condition: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
}

interface FeedProps {
  currentUser: any;
}

const Feed: React.FC<FeedProps> = ({ currentUser }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await (await import('../client')).api.get('/posts')
      setPosts(data)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setIsLoading(false)
    }
  };

  const handleAddPost = async () => {
    if (newPost.trim() && currentUser) {
      try {
        await (await import('../client')).api.post('/posts', {
          author_id: currentUser.id,
          content: newPost
        })
        setNewPost('')
        fetchPosts()
      } catch (error) {
        console.error('Failed to create post:', error)
      }
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      await (await import('../client')).api.post(`/posts/${postId}/like`, { user_id: currentUser?.id })
      // refresh or apply returned changes
      fetchPosts()
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  return (
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
            </div >
          </div >
        ))}
      </div >
    </div >
  );
};

export default Feed;
