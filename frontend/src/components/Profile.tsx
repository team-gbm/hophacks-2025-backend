import { useState } from 'react'
import { useEffect } from 'react'
import { UserProfile } from '../types'
import { User, FileText, Calendar } from 'lucide-react'

type Props = {
  profile: UserProfile
  isEditing: boolean
  editForm: UserProfile
  setEditForm: (p: UserProfile) => void
  onToggleEdit: () => void
  onLocalSave?: (p: UserProfile) => void
}
export default function Profile({ profile, isEditing, editForm, setEditForm, onToggleEdit, onLocalSave }: Props) {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [displayProfile, setDisplayProfile] = useState<UserProfile>(profile)
  const [initialLoading, setInitialLoading] = useState(true)

  const update = (field: keyof UserProfile, value: any) => setEditForm({ ...editForm, [field]: value })
  // initialize display profile from props
  useEffect(() => {
    setDisplayProfile(profile)
    setEditForm(profile)
    setInitialLoading(false)
  }, [profile])

  const saveToServer = async () => {
    // local save: update display and notify parent
    setLoading(true)
    setStatus(null)
    try {
      const mappedBack = { ...editForm }
      setDisplayProfile(mappedBack)
      onLocalSave && onLocalSave(mappedBack)
      setStatus('Profile saved')
    } catch (err: any) {
      setStatus('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    // reinitialize from props
    setStatus(null)
    setDisplayProfile(profile)
    setEditForm(profile)
    setInitialLoading(false)
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-lg text-white">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center"><User size={48} /></div>
          <div>
            <h1 className="text-2xl font-bold">{displayProfile.name}</h1>
            <p className="text-blue-100">{displayProfile.age} years • {displayProfile.location}</p>
            <p className="mt-2">{displayProfile.bio}</p>
          </div>
        </div>
        <button onClick={onToggleEdit} className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg">{isEditing ? 'Cancel Editing' : 'Edit Profile'}</button>
      </div>

      <div className="p-6">
        {initialLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}
        {status && status.toLowerCase().includes('failed') && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded mb-4">
            <div className="font-semibold">Error</div>
            <div className="text-sm">{status}</div>
            <div className="mt-2">
              <button onClick={handleRetry} className="mt-2 bg-red-600 text-white px-3 py-1 rounded">Retry</button>
            </div>
          </div>
        )}
        {!isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 flex items-center"><FileText className="mr-2" size={20} />Medical Information</h2>
                <div className="space-y-3">
                  <div><span className="font-medium">Condition:</span> {displayProfile.condition}</div>
                  <div><span className="font-medium">Diagnosed:</span> {displayProfile.diagnosisDate}</div>
                  <div><span className="font-medium">Hospital:</span> {displayProfile.hospital}</div>
                  <div><span className="font-medium">Doctor:</span> {displayProfile.doctor}</div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 flex items-center"><Calendar className="mr-2" size={20} />Treatment Plan</h2>
                <div>{displayProfile.treatment}</div>
                <div className="mt-3"><span className="font-medium">Medications:</span> {displayProfile.medications.join(', ')}</div>
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
