import React, { useState } from "react";
import { User, FileText, Calendar, Clock, MapPin } from "lucide-react";

interface UserType {
  id: number;
  username: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  condition: string;
  diagnosis_date: string;
  hospital: string;
  doctor: string;
  treatment: string;
  medications: string[];
  progress: string;
  goals: string;
}

interface ProfileProps {
  user: UserType;
}

const API_BASE = "/api";

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        setIsEditing(false);
        // In a real app, you'd update the user context or refetch
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditChange = (field: string, value: string | string[]) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
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
    <div className="bg-white rounded-lg shadow">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-lg text-white">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User size={48} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-blue-100">{user.age} years • {user.location}</p>
            <p className="mt-2">{user.bio}</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          disabled={isSaving}
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
                    <span className="font-medium">Condition:</span> {user.condition}
                  </div>
                  <div>
                    <span className="font-medium">Diagnosed:</span> {user.diagnosis_date}
                  </div>
                  <div>
                    <span className="font-medium">Hospital:</span> {user.hospital}
                  </div>
                  <div>
                    <span className="font-medium">Doctor:</span> {user.doctor}
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
                    <span className="font-medium">Treatment:</span> {user.treatment}
                  </div>
                  <div>
                    <span className="font-medium">Medications:</span>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      {user.medications.map((med, index) => (
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
                <p>{user.progress}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="mr-2" size={20} />
                  Recovery Goals
                </h2>
                <p>{user.goals}</p>
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
                  value={editForm.diagnosis_date}
                  onChange={(e) => handleEditChange('diagnosis_date', e.target.value)}
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
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
