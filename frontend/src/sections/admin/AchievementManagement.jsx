import { useState } from 'react';
import { Pencil, Star, Trash2 } from 'lucide-react';
import AssetUploadField from '../../components/admin/AssetUploadField';
import OrderControls from '../../components/admin/OrderControls';
import { moveOrderedItem } from '../../lib/admin';
import { api } from '../../services/api';
import { useStore } from '../../store/useStore';

const EMPTY_FORM = {
  title: '',
  description: '',
  type: 'other',
  issuer: '',
  issuerLogo: '',
  date: '',
  position: '',
  certificateURL: '',
  image: '',
  featured: false,
  order: 0,
};

export default function AchievementManagement() {
  const achievements = useStore((state) => state.achievements);
  const fetchAllData = useStore((state) => state.fetchAllData);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...form, order: Number(form.order) || 0 };

    if (editingId) {
      await api.updateAchievement(editingId, payload);
    } else {
      await api.createAchievement(payload);
    }

    setEditingId(null);
    setForm(EMPTY_FORM);
    await fetchAllData();
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      type: item.type || 'other',
      issuer: item.issuer || '',
      issuerLogo: item.issuerLogo || '',
      date: item.date?.slice(0, 10) || '',
      position: item.position || '',
      certificateURL: item.certificateURL || '',
      image: item.image || '',
      featured: Boolean(item.featured),
      order: item.order ?? 0,
    });
  };

  const moveAchievement = async (index, direction) => {
    await moveOrderedItem({
      items: achievements,
      index,
      direction,
      updateItem: api.updateAchievement,
      refresh: fetchAllData,
    });
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">Admin section</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Achievement Management</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,14,28,0.92),rgba(9,17,31,0.78))] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.3)] backdrop-blur-2xl">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-4 lg:grid-cols-2">
            <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <select className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {['award', 'competition', 'hackathon', 'recognition', 'other'].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Issuer" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} />
            <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Position / rank" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            <input type="date" className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <input type="url" className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Proof / certificate URL" value={form.certificateURL} onChange={(e) => setForm({ ...form, certificateURL: e.target.value })} />
            <input type="number" className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            <label className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Feature this achievement
            </label>
            <textarea className="min-h-28 rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none lg:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="space-y-5">
            <AssetUploadField label="Issuer logo" value={form.issuerLogo} onChange={(value) => setForm({ ...form, issuerLogo: value })} hint="Small recognition or organizer logos work best." />
            <AssetUploadField label="Achievement image" value={form.image} onChange={(value) => setForm({ ...form, image: value })} hint="Upload award proof, team photo, or visual evidence." />
          </div>
        </div>

        <div className="flex gap-3">
          <button className="rounded-[22px] bg-[linear-gradient(135deg,#06b6d4,#2563eb)] px-5 py-4 text-sm font-semibold text-white transition hover:brightness-110">
            {editingId ? 'Update Achievement' : 'Add Achievement'}
          </button>
          {editingId ? (
            <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }} className="rounded-[22px] border border-white/10 px-5 py-4 text-sm font-semibold text-slate-300 transition hover:bg-white/5">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-4">
        {achievements.map((item, index) => (
          <div key={item._id} className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.9),rgba(8,15,30,0.72))] p-5 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {item.issuerLogo ? <img src={item.issuerLogo} alt={item.issuer || item.title} className="h-14 w-14 rounded-2xl border border-white/10 object-cover" /> : null}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                  {item.featured ? <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-amber-300">Featured</span> : null}
                </div>
                <p className="mt-1 text-sm text-slate-400">{item.issuer || item.type}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <OrderControls index={index} total={achievements.length} onMove={moveAchievement} />
              <button onClick={() => handleEdit(item)} className="inline-flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/15">
                <Pencil size={16} /> Edit
              </button>
              <button onClick={async () => { await api.toggleFeaturedAchievement(item._id); await fetchAllData(); }} className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/15">
                <Star size={16} /> Toggle Featured
              </button>
              <button onClick={async () => { await api.deleteAchievement(item._id); await fetchAllData(); }} className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/15">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
        {!achievements.length ? <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-slate-400">No achievements added yet.</div> : null}
      </div>
    </section>
  );
}
