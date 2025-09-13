import { useState } from 'react'
import { useEffect } from 'react'
import { UserProfile } from '../types'
import { User, FileText, Calendar } from 'lucide-react'
import { api } from '../client'

type Props = {
  userId: number
  profile: UserProfile
  isEditing: boolean
  editForm: UserProfile
  setEditForm: (p: UserProfile) => void
  onToggleEdit: () => void
  onLocalSave?: (p: UserProfile) => void
}

export default function Profile({ userId, profile, isEditing, editForm, setEditForm, onToggleEdit, onLocalSave }: Props) {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const update = (field: keyof UserProfile, value: any) => setEditForm({ ...editForm, [field]: value })

  // fetch profile on mount or when userId changes
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setStatus(null)
      try {
        const res = await api.get(`/profile/${userId}`)
        if (!res || typeof res !== 'object') return
        const mapped = {
          name: res.name || '',
          age: res.age || 0,
          location: res.location || '',
          bio: res.bio || '',
          condition: res.condition || '',
          diagnosisDate: res.diagnosis_date || res.diagnosisDate || '',
          hospital: res.hospital || '',
          doctor: res.doctor || '',
          treatment: res.treatment || '',
          medications: res.medications || [],
          progress: res.progress || '',
          goals: res.goals || ''
        }
        if (!cancelled) {
          setEditForm(mapped as UserProfile)
          onLocalSave && onLocalSave(mapped as UserProfile)
        }
      } catch (err: any) {
        if (!cancelled) setStatus('Failed to load profile')
      }
    }
    load()
    return () => { cancelled = true }
  }, [userId])

  const saveToServer = async () => {
    setLoading(true)
    setStatus(null)
    try {
      // map frontend camelCase -> backend snake_case
      const payload = {
        name: editForm.name,
        age: editForm.age,
        location: editForm.location,
        bio: editForm.bio,
        condition: editForm.condition,
        diagnosis_date: (editForm as any).diagnosisDate || (editForm as any).diagnosis_date,
        hospital: editForm.hospital,
        doctor: editForm.doctor,
        treatment: editForm.treatment,
        medications: editForm.medications,
        progress: editForm.progress,
        goals: editForm.goals,
      }
      const res = await api.put(`/profile/${userId}`, payload)
      // backend returns { message, user }
      const updatedUser = res?.user || res
      const mappedBack = {
        name: updatedUser.name || '',
        age: updatedUser.age || 0,
        location: updatedUser.location || '',
        bio: updatedUser.bio || '',
        condition: updatedUser.condition || '',
        diagnosisDate: updatedUser.diagnosis_date || updatedUser.diagnosisDate || '',
        hospital: updatedUser.hospital || '',
        doctor: updatedUser.doctor || '',
        treatment: updatedUser.treatment || '',
        medications: updatedUser.medications || [],
        progress: updatedUser.progress || '',
        goals: updatedUser.goals || ''
      }
      setStatus('Profile saved')
      onLocalSave && onLocalSave(mappedBack as UserProfile)
    } catch (err: any) {
      setStatus(err?.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-lg text-white">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center"><User size={48} /></div>
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-blue-100">{profile.age} years • {profile.location}</p>
            <p className="mt-2">{profile.bio}</p>
          </div>
        </div>
        <button onClick={onToggleEdit} className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg">{isEditing ? 'Cancel Editing' : 'Edit Profile'}</button>
      </div>

      <div className="p-6">
        {!isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 flex items-center"><FileText className="mr-2" size={20} />Medical Information</h2>
                <div className="space-y-3">
                  <div><span className="font-medium">Condition:</span> {profile.condition}</div>
                  <div><span className="font-medium">Diagnosed:</span> {profile.diagnosisDate}</div>
                  <div><span className="font-medium">Hospital:</span> {profile.hospital}</div>
                  <div><span className="font-medium">Doctor:</span> {profile.doctor}</div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 flex items-center"><Calendar className="mr-2" size={20} />Treatment Plan</h2>
                <div>{profile.treatment}</div>
                <div className="mt-3"><span className="font-medium">Medications:</span> {profile.medications.join(', ')}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <input value={editForm.name} onChange={e => update('name', e.target.value)} className="w-full p-2 border rounded" />
            <textarea value={editForm.bio} onChange={e => update('bio', e.target.value)} className="w-full p-2 border rounded" />
            <div className="flex items-center space-x-3">
              <button onClick={saveToServer} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Saving...' : 'Save'}</button>
              <button onClick={() => { onToggleEdit(); setStatus(null) }} className="px-4 py-2 border rounded">Cancel</button>
            </div>
            {status && <div className="mt-2 text-sm text-gray-700">{status}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
