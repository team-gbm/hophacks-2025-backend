import React, { useState, useEffect } from "react";

interface Game {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  image_url: string;
}

const API_BASE = "/api";

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch(`${API_BASE}/games`);
      if (response.ok) {
        const data = await response.json();
        setGames(data);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading games...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Therapeutic Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <img 
                src={game.image_url} 
                alt={`${game.title} therapeutic game interface`}
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
  );
};

export default Games;