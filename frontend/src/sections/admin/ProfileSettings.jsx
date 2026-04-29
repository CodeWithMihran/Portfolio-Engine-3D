import { useState } from 'react';
import { Save } from 'lucide-react';
import AssetUploadField from '../../components/admin/AssetUploadField';
import { api } from '../../services/api';
import { useStore } from '../../store/useStore';

function ProfileForm({ initialProfile, onSaved }) {
  const [formData, setFormData] = useState({
    fullName: initialProfile?.fullName || '',
    title: initialProfile?.title || '',
    bio: initialProfile?.bio || '',
    about: initialProfile?.about || '',
    email: initialProfile?.email || '',
    location: initialProfile?.location || '',
    availability: initialProfile?.availability || '',
    profileImage: initialProfile?.profileImage || '',
    resume: initialProfile?.resume || '',
    socialLinks: {
      github: initialProfile?.socialLinks?.github || '',
      linkedin: initialProfile?.socialLinks?.linkedin || '',
      website: initialProfile?.socialLinks?.website || '',
    },
    seo: {
      ogImage: initialProfile?.seo?.ogImage || '',
    },
  });

  const handleSave = async (event) => {
    event.preventDefault();
    await api.upsertProfile(formData);
    onSaved();
  };

  const updateSocial = (key, value) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [key]: value,
      },
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,14,28,0.92),rgba(9,17,31,0.78))] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.3)] backdrop-blur-2xl">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Full name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
            <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none md:col-span-2" placeholder="Availability" value={formData.availability} onChange={(e) => setFormData({ ...formData, availability: e.target.value })} />
            <textarea className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none md:col-span-2" rows={3} placeholder="Bio / introduction" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
            <textarea className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none md:col-span-2" rows={5} placeholder="About section content" value={formData.about} onChange={(e) => setFormData({ ...formData, about: e.target.value })} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="GitHub URL" value={formData.socialLinks.github} onChange={(e) => updateSocial('github', e.target.value)} />
            <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="LinkedIn URL" value={formData.socialLinks.linkedin} onChange={(e) => updateSocial('linkedin', e.target.value)} />
            <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none md:col-span-2" placeholder="Website URL" value={formData.socialLinks.website} onChange={(e) => updateSocial('website', e.target.value)} />
            <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none md:col-span-2" placeholder="Resume URL" value={formData.resume} onChange={(e) => setFormData({ ...formData, resume: e.target.value })} />
          </div>
        </div>

        <div className="space-y-5">
          <AssetUploadField label="Profile image" value={formData.profileImage} onChange={(value) => setFormData({ ...formData, profileImage: value })} hint="Used for your hero and identity previews." />
          <AssetUploadField label="OG / share image" value={formData.seo.ogImage} onChange={(value) => setFormData({ ...formData, seo: { ...formData.seo, ogImage: value } })} hint="Used when the portfolio is shared." />
        </div>
      </div>

      <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-[24px] bg-[linear-gradient(135deg,#06b6d4,#2563eb)] py-4 font-bold text-white shadow-[0_18px_45px_rgba(37,99,235,0.25)] transition hover:brightness-110">
        <Save size={20} /> Save Profile Updates
      </button>
    </form>
  );
}

export default function ProfileSettings() {
  const profile = useStore((state) => state.profile);
  const fetchAllData = useStore((state) => state.fetchAllData);

  return (
    <section className="space-y-6">
      <div className="max-w-3xl">
        <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">Admin section</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Profile Settings</h1>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          Update your identity, social links, and core portfolio assets from one cleaner command surface.
        </p>
      </div>
      <ProfileForm key={profile?._id || 'profile-form'} initialProfile={profile} onSaved={fetchAllData} />
    </section>
  );
}
