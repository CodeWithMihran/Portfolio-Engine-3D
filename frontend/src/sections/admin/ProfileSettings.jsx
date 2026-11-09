import { useId, useState } from 'react';
import { ExternalLink, FileText, LoaderCircle, Save, Upload } from 'lucide-react';
import AssetUploadField from '../../components/admin/AssetUploadField';
import { api } from '../../services/api';
import { useStore } from '../../store/useStore';

function ResumeUploadField({ value, onChange }) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Choose a PDF file for your resume.');
      event.target.value = '';
      return;
    }

    setError('');
    setUploading(true);
    try {
      const response = await api.uploadAsset(file);
      onChange(response.data.imageUrl);
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || 'Resume upload failed. Please try again.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-3 md:col-span-2">
      <label htmlFor={`${inputId}-url`} className="block text-[10px] font-mono uppercase tracking-[0.24em] text-slate-500">
        Resume / CV PDF
      </label>
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/85 p-3 sm:flex-row">
        <input
          id={`${inputId}-url`}
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500"
          placeholder="Paste a direct PDF URL or upload your CV"
        />
        <label
          htmlFor={inputId}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-200/15 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/15"
        >
          {uploading ? <LoaderCircle size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? 'Uploading PDF...' : 'Upload PDF'}
        </label>
        <input id={inputId} type="file" accept="application/pdf,.pdf" disabled={uploading} className="hidden" onChange={handleUpload} />
      </div>
      <p className="text-xs leading-5 text-slate-500">The uploaded file is saved to your portfolio after you save these profile changes.</p>
      {value ? (
        <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold text-rose-200 transition hover:text-white">
          <FileText size={14} /> Preview current CV <ExternalLink size={12} />
        </a>
      ) : null}
      {error ? <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
    </div>
  );
}

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
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaved(false);
    try {
      await api.upsertProfile(formData);
      await onSaved();
      setSaved(true);
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Could not save profile changes. Please try again.');
    } finally {
      setSaving(false);
    }
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
            <ResumeUploadField value={formData.resume} onChange={(resume) => setFormData({ ...formData, resume })} />
          </div>
        </div>

        <div className="space-y-5">
          <AssetUploadField label="Profile image" value={formData.profileImage} onChange={(value) => setFormData({ ...formData, profileImage: value })} hint="Used for your hero and identity previews." />
          <AssetUploadField label="OG / share image" value={formData.seo.ogImage} onChange={(value) => setFormData({ ...formData, seo: { ...formData.seo, ogImage: value } })} hint="Used when the portfolio is shared." />
        </div>
      </div>

      {saveError ? <p role="alert" className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{saveError}</p> : null}
      {saved ? <p role="status" className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">Profile updates saved.</p> : null}
      <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-[24px] bg-[linear-gradient(135deg,#06b6d4,#2563eb)] py-4 font-bold text-white shadow-[0_18px_45px_rgba(37,99,235,0.25)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
        <Save size={20} /> {saving ? 'Saving profile...' : 'Save Profile Updates'}
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
