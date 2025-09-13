import React, { useState, useEffect } from "react";
import { User } from "lucide-react";

interface Connection {
  id: number;
  name: string;
  condition: string;
  journey: string;
  location: string;
  status: string;
}

const API_BASE = "/api";

const Connect: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await fetch(`${API_BASE}/connections`);
      if (response.ok) {
        const data = await response.json();
        setConnections(data);
      }
    } catch (error) {
      console.error('Failed to fetch connections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/connect/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConnections(connections.map(connection =>
          connection.id === userId ? data.connection : connection
        ));
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading connections...</div>;
  }

  return (
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
  );
};

export default Connect;