import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2, Zap } from 'lucide-react';
import AssetUploadField from '../../components/admin/AssetUploadField';
import OrderControls from '../../components/admin/OrderControls';
import { moveOrderedItem } from '../../lib/admin';
import { createSkillIconFallback, resolveMediaUrl } from '../../lib/media';
import { api } from '../../services/api';
import { useStore } from '../../store/useStore';

export default function SkillManagement() {
  const skills = useStore((state) => state.skills);
  const fetchAllData = useStore((state) => state.fetchAllData);
  const [editingId, setEditingId] = useState(null);
  const blankSkill = useMemo(
    () => ({ name: '', category: 'frontend', proficiency: 80, icon: '', color: '#8b5cf6', order: 0 }),
    []
  );
  const [newSkill, setNewSkill] = useState(blankSkill);

  const addSkill = async (event) => {
    event.preventDefault();
    const payload = {
      ...newSkill,
      proficiency: Number(newSkill.proficiency) || 80,
      order: Number(newSkill.order) || 0,
    };

    if (editingId) {
      await api.updateSkill(editingId, payload);
    } else {
      await api.createSkill(payload);
    }
    setEditingId(null);
    setNewSkill(blankSkill);
    await fetchAllData();
  };

  const startEdit = (skill) => {
    setEditingId(skill._id);
    setNewSkill({
      name: skill.name || '',
      category: skill.category || 'frontend',
      proficiency: skill.proficiency || 80,
      icon: skill.icon || '',
      color: skill.color || '#8b5cf6',
      order: skill.order ?? 0,
    });
  };

  const moveSkill = async (index, direction) => {
    await moveOrderedItem({
      items: skills,
      index,
      direction,
      updateItem: api.updateSkill,
      refresh: fetchAllData,
    });
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">Admin section</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Skill Management</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Upload cleaner icons, tune ordering, and shape the 3D tech stack into a sharper showcase.
        </p>
      </div>

      <form
        onSubmit={addSkill}
        className="space-y-6 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,14,28,0.92),rgba(9,17,31,0.78))] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.3)] backdrop-blur-2xl"
      >
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">Skill name</label>
                <input
                  className="w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 text-white outline-none transition focus:border-cyan-300/30"
                  value={newSkill.name}
                  onChange={(event) => setNewSkill({ ...newSkill, name: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">Category</label>
                <select
                  className="w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 text-white outline-none transition focus:border-cyan-300/30"
                  value={newSkill.category}
                  onChange={(event) => setNewSkill({ ...newSkill, category: event.target.value })}
                >
                  {['frontend', 'backend', 'database', 'programming', 'tools', 'other'].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">Proficiency</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 text-white outline-none transition focus:border-cyan-300/30"
                  value={newSkill.proficiency}
                  onChange={(event) => setNewSkill({ ...newSkill, proficiency: Number(event.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">Tint</label>
                <input
                  type="color"
                  className="h-[58px] w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-3 outline-none"
                  value={newSkill.color}
                  onChange={(event) => setNewSkill({ ...newSkill, color: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">Display order</label>
                <input
                  type="number"
                  className="w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 text-white outline-none transition focus:border-cyan-300/30"
                  value={newSkill.order}
                  onChange={(event) => setNewSkill({ ...newSkill, order: event.target.value })}
                />
              </div>
            </div>
          </div>

          <AssetUploadField
            label="Skill icon"
            value={newSkill.icon}
            onChange={(value) => setNewSkill({ ...newSkill, icon: value })}
            hint="SVG or PNG icons work best for the skill balls."
          />
        </div>

        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-[22px] bg-[linear-gradient(135deg,#06b6d4,#2563eb)] px-6 py-4 font-semibold text-white shadow-[0_16px_40px_rgba(37,99,235,0.2)] transition hover:brightness-110">
            <Plus size={18} />
            {editingId ? 'Update Skill' : 'Add Skill'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewSkill(blankSkill);
              }}
              className="rounded-[22px] border border-white/10 px-5 py-4 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((skill, index) => {
          const preview = resolveMediaUrl(skill.icon, createSkillIconFallback(skill.name));

          return (
            <div
              key={skill._id}
              className="flex items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.9),rgba(8,15,30,0.72))] px-5 py-4 backdrop-blur-xl"
            >
              <div className="flex min-w-0 items-center gap-4">
                <img src={preview} alt={skill.name} className="h-14 w-14 rounded-2xl border border-white/10 object-cover" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-white">{skill.name}</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">
                      {skill.category}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Proficiency {skill.proficiency}%</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <OrderControls index={index} total={skills.length} onMove={moveSkill} />
                <button onClick={() => startEdit(skill)} className="text-slate-500 transition-colors hover:text-cyan-300">
                  <Pencil size={16} />
                </button>
                <button onClick={async () => { await api.deleteSkill(skill._id); await fetchAllData(); }} className="text-slate-600 transition-colors hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {!skills.length ? (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-slate-400 md:col-span-2">
            No skills found yet.
          </div>
        ) : null}
      </div>
    </section>
  );
}
