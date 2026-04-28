import { useState } from 'react';
import { Save } from 'lucide-react';
import { api } from '../../services/api';
import { useStore } from '../../store/useStore';

function ProfileForm({ initialProfile, onSaved }) {
  const [formData, setFormData] = useState({
    fullName: initialProfile?.fullName || '',
    title: initialProfile?.title || '',
    bio: initialProfile?.bio || '',
    email: initialProfile?.email || '',
    location: initialProfile?.location || '',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    await api.upsertProfile(formData);
    window.alert('Profile Core Synchronized');
    onSaved();
  };

  return (
    <form onSubmit={handleSave} className="bento-card space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase text-slate-500">Full Name</label>
          <input className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase text-slate-500">Title</label>
          <input className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-mono uppercase text-slate-500">Bio / Introduction</label>
        <textarea className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" rows={3} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase text-slate-500">Email</label>
          <input className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase text-slate-500">Location</label>
          <input className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
        </div>
      </div>

      <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold shadow-xl shadow-blue-900/20 transition hover:bg-blue-500">
        <Save size={20} /> PUSH_UPDATES_TO_LIVE
      </button>
    </form>
  );
}

export default function ProfileSettings() {
  const profile = useStore((state) => state.profile);
  const fetchAllData = useStore((state) => state.fetchAllData);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 text-3xl font-bold text-white">CORE_IDENTITY_CONFIG</h1>
      <ProfileForm key={profile?._id || 'profile-form'} initialProfile={profile} onSaved={fetchAllData} />
    </div>
  );
}
