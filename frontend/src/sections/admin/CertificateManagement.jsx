import { useState } from 'react';
import { Pencil, Star, Trash2 } from 'lucide-react';
import AssetUploadField from '../../components/admin/AssetUploadField';
import OrderControls from '../../components/admin/OrderControls';
import { moveOrderedItem } from '../../lib/admin';
import { api } from '../../services/api';
import { useStore } from '../../store/useStore';

const EMPTY_FORM = {
  title: '',
  issuer: '',
  issuerLogo: '',
  issueDate: '',
  expiryDate: '',
  credentialId: '',
  credentialURL: '',
  description: '',
  certificateImage: '',
  featured: false,
  order: 0,
};

export default function CertificateManagement() {
  const certificates = useStore((state) => state.certificates);
  const fetchAllData = useStore((state) => state.fetchAllData);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      expiryDate: form.expiryDate || null,
      order: Number(form.order) || 0,
    };

    if (editingId) {
      await api.updateCertificate(editingId, payload);
    } else {
      await api.createCertificate(payload);
    }

    setEditingId(null);
    setForm(EMPTY_FORM);
    await fetchAllData();
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      issuer: item.issuer || '',
      issuerLogo: item.issuerLogo || '',
      issueDate: item.issueDate?.slice(0, 10) || '',
      expiryDate: item.expiryDate?.slice(0, 10) || '',
      credentialId: item.credentialId || '',
      credentialURL: item.credentialURL || '',
      description: item.description || '',
      certificateImage: item.certificateImage || '',
      featured: Boolean(item.featured),
      order: item.order ?? 0,
    });
  };

  const moveCertificate = async (index, direction) => {
    await moveOrderedItem({
      items: certificates,
      index,
      direction,
      updateItem: api.updateCertificate,
      refresh: fetchAllData,
    });
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">Admin section</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Certificate Management</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,14,28,0.92),rgba(9,17,31,0.78))] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.3)] backdrop-blur-2xl">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-4 lg:grid-cols-2">
            <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Issuer" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} />
            <input type="date" className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} />
            <input type="date" className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
            <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Credential ID" value={form.credentialId} onChange={(e) => setForm({ ...form, credentialId: e.target.value })} />
            <input type="url" className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Credential verification URL" value={form.credentialURL} onChange={(e) => setForm({ ...form, credentialURL: e.target.value })} />
            <input type="number" className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            <label className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Feature this certificate
            </label>
            <textarea className="min-h-28 rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none lg:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="space-y-5">
            <AssetUploadField label="Issuer logo" value={form.issuerLogo} onChange={(value) => setForm({ ...form, issuerLogo: value })} hint="Small square logos work best." />
            <AssetUploadField label="Certificate image" value={form.certificateImage} onChange={(value) => setForm({ ...form, certificateImage: value })} hint="Upload the certificate cover or proof image." />
          </div>
        </div>

        <div className="flex gap-3">
          <button className="rounded-[22px] bg-[linear-gradient(135deg,#06b6d4,#2563eb)] px-5 py-4 text-sm font-semibold text-white transition hover:brightness-110">
            {editingId ? 'Update Certificate' : 'Add Certificate'}
          </button>
          {editingId ? (
            <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }} className="rounded-[22px] border border-white/10 px-5 py-4 text-sm font-semibold text-slate-300 transition hover:bg-white/5">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-4">
        {certificates.map((item, index) => (
          <div key={item._id} className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.9),rgba(8,15,30,0.72))] p-5 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {item.issuerLogo ? <img src={item.issuerLogo} alt={item.issuer} className="h-14 w-14 rounded-2xl border border-white/10 object-cover" /> : null}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                  {item.featured ? <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-amber-300">Featured</span> : null}
                </div>
                <p className="mt-1 text-sm text-slate-400">{item.issuer}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <OrderControls index={index} total={certificates.length} onMove={moveCertificate} />
              <button onClick={() => handleEdit(item)} className="inline-flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/15">
                <Pencil size={16} /> Edit
              </button>
              <button onClick={async () => { await api.toggleFeaturedCertificate(item._id); await fetchAllData(); }} className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/15">
                <Star size={16} /> Toggle Featured
              </button>
              <button onClick={async () => { await api.deleteCertificate(item._id); await fetchAllData(); }} className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/15">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
        {!certificates.length ? <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-slate-400">No certificates added yet.</div> : null}
      </div>
    </section>
  );
}
