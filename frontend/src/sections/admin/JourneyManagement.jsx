import { useState } from 'react';
import { Briefcase, GraduationCap, Pencil, Plus, Trash2 } from 'lucide-react';
import AssetUploadField from '../../components/admin/AssetUploadField';
import OrderControls from '../../components/admin/OrderControls';
import { moveOrderedItem } from '../../lib/admin';
import { api } from '../../services/api';
import { useStore } from '../../store/useStore';

const EMPTY_EXPERIENCE = {
  companyName: '',
  companyLogo: '',
  companyWebsite: '',
  role: '',
  employmentType: 'internship',
  location: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  description: '',
  responsibilities: '',
  technologies: '',
  order: 0,
};

const EMPTY_EDUCATION = {
  institutionName: '',
  institutionLogo: '',
  degree: '',
  fieldOfStudy: '',
  location: '',
  startDate: '',
  endDate: '',
  currentlyStudying: false,
  grade: '',
  description: '',
  coursework: '',
  achievements: '',
  order: 0,
};

function JourneyCard({ title, icon, children }) {
  const Icon = icon;

  return (
    <div className="space-y-5 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,14,28,0.92),rgba(9,17,31,0.78))] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.3)] backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
          <Icon size={18} />
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function JourneyManagement() {
  const experience = useStore((state) => state.experience);
  const education = useStore((state) => state.education);
  const fetchAllData = useStore((state) => state.fetchAllData);
  const [experienceForm, setExperienceForm] = useState(EMPTY_EXPERIENCE);
  const [educationForm, setEducationForm] = useState(EMPTY_EDUCATION);
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [editingEducationId, setEditingEducationId] = useState(null);

  const resetExperience = () => {
    setEditingExperienceId(null);
    setExperienceForm(EMPTY_EXPERIENCE);
  };

  const resetEducation = () => {
    setEditingEducationId(null);
    setEducationForm(EMPTY_EDUCATION);
  };

  const deleteItem = async (type, id) => {
    if (type === 'exp') {
      await api.deleteExperience(id);
    } else {
      await api.deleteEducation(id);
    }
    await fetchAllData();
  };

  const saveExperience = async (event) => {
    event.preventDefault();
    const payload = {
      ...experienceForm,
      responsibilities: experienceForm.responsibilities
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      technologies: experienceForm.technologies
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      endDate: experienceForm.currentlyWorking ? null : experienceForm.endDate || null,
      order: Number(experienceForm.order) || 0,
    };

    if (editingExperienceId) {
      await api.updateExperience(editingExperienceId, payload);
    } else {
      await api.createExperience(payload);
    }

    resetExperience();
    await fetchAllData();
  };

  const saveEducation = async (event) => {
    event.preventDefault();
    const payload = {
      ...educationForm,
      coursework: educationForm.coursework
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      achievements: educationForm.achievements
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      endDate: educationForm.currentlyStudying ? null : educationForm.endDate || null,
      order: Number(educationForm.order) || 0,
    };

    if (editingEducationId) {
      await api.updateEducation(editingEducationId, payload);
    } else {
      await api.createEducation(payload);
    }

    resetEducation();
    await fetchAllData();
  };

  const editExperience = (item) => {
    setEditingExperienceId(item._id);
    setExperienceForm({
      companyName: item.companyName || '',
      companyLogo: item.companyLogo || '',
      companyWebsite: item.companyWebsite || '',
      role: item.role || '',
      employmentType: item.employmentType || 'internship',
      location: item.location || '',
      startDate: item.startDate?.slice(0, 10) || '',
      endDate: item.endDate?.slice(0, 10) || '',
      currentlyWorking: Boolean(item.currentlyWorking),
      description: item.description || '',
      responsibilities: (item.responsibilities || []).join('\n'),
      technologies: (item.technologies || []).join(', '),
      order: item.order ?? 0,
    });
  };

  const editEducation = (item) => {
    setEditingEducationId(item._id);
    setEducationForm({
      institutionName: item.institutionName || '',
      institutionLogo: item.institutionLogo || '',
      degree: item.degree || '',
      fieldOfStudy: item.fieldOfStudy || '',
      location: item.location || '',
      startDate: item.startDate?.slice(0, 10) || '',
      endDate: item.endDate?.slice(0, 10) || '',
      currentlyStudying: Boolean(item.currentlyStudying),
      grade: item.grade || '',
      description: item.description || '',
      coursework: (item.coursework || []).join('\n'),
      achievements: (item.achievements || []).join('\n'),
      order: item.order ?? 0,
    });
  };

  const moveExperience = async (index, direction) => {
    await moveOrderedItem({
      items: experience,
      index,
      direction,
      updateItem: api.updateExperience,
      refresh: fetchAllData,
    });
  };

  const moveEducation = async (index, direction) => {
    await moveOrderedItem({
      items: education,
      index,
      direction,
      updateItem: api.updateEducation,
      refresh: fetchAllData,
    });
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">Admin section</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Journey Management</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Update experience and education with logos, cleaner ordering, and richer content for the timeline sections.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <JourneyCard title="Experience" icon={Briefcase}>
          <div className="flex justify-end">
            <button type="button" onClick={resetExperience} className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.22em] text-cyan-100 transition hover:bg-cyan-400/15">
              <Plus size={14} /> New entry
            </button>
          </div>

          <form onSubmit={saveExperience} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Company" value={experienceForm.companyName} onChange={(e) => setExperienceForm({ ...experienceForm, companyName: e.target.value })} />
              <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Role" value={experienceForm.role} onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })} />
              <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Company website" value={experienceForm.companyWebsite} onChange={(e) => setExperienceForm({ ...experienceForm, companyWebsite: e.target.value })} />
              <select className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" value={experienceForm.employmentType} onChange={(e) => setExperienceForm({ ...experienceForm, employmentType: e.target.value })}>
                {['full-time', 'part-time', 'internship', 'freelance'].map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Location" value={experienceForm.location} onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })} />
              <input type="number" className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Order" value={experienceForm.order} onChange={(e) => setExperienceForm({ ...experienceForm, order: e.target.value })} />
              <input type="date" className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" value={experienceForm.startDate} onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })} />
              <input type="date" className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" value={experienceForm.endDate} onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })} disabled={experienceForm.currentlyWorking} />
            </div>

            <AssetUploadField label="Company logo" value={experienceForm.companyLogo} onChange={(value) => setExperienceForm({ ...experienceForm, companyLogo: value })} hint="Used inside the experience cards on the public site." />

            <label className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
              <input type="checkbox" checked={experienceForm.currentlyWorking} onChange={(e) => setExperienceForm({ ...experienceForm, currentlyWorking: e.target.checked })} />
              Currently working here
            </label>
            <textarea className="min-h-24 w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Short description" value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} />
            <textarea className="min-h-24 w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Responsibilities, one per line" value={experienceForm.responsibilities} onChange={(e) => setExperienceForm({ ...experienceForm, responsibilities: e.target.value })} />
            <input className="w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Technologies, comma separated" value={experienceForm.technologies} onChange={(e) => setExperienceForm({ ...experienceForm, technologies: e.target.value })} />

            <div className="flex gap-3">
              <button className="rounded-[22px] bg-[linear-gradient(135deg,#06b6d4,#2563eb)] px-5 py-4 text-sm font-semibold text-white transition hover:brightness-110">
                {editingExperienceId ? 'Update Experience' : 'Add Experience'}
              </button>
              {editingExperienceId ? <button type="button" onClick={resetExperience} className="rounded-[22px] border border-white/10 px-5 py-4 text-sm font-semibold text-slate-300 transition hover:bg-white/5">Cancel</button> : null}
            </div>
          </form>

          <div className="space-y-3">
            {experience.map((exp, index) => (
              <div key={exp._id} className="flex items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                <div>
                  <p className="font-bold text-sm text-white">{exp.role}</p>
                  <p className="text-xs text-slate-500">{exp.companyName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderControls index={index} total={experience.length} onMove={moveExperience} />
                  <button onClick={() => editExperience(exp)} className="text-cyan-300"><Pencil size={16} /></button>
                  <button onClick={() => deleteItem('exp', exp._id)} className="text-rose-500"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </JourneyCard>

        <JourneyCard title="Education" icon={GraduationCap}>
          <div className="flex justify-end">
            <button type="button" onClick={resetEducation} className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.22em] text-emerald-100 transition hover:bg-emerald-400/15">
              <Plus size={14} /> New entry
            </button>
          </div>

          <form onSubmit={saveEducation} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Institution" value={educationForm.institutionName} onChange={(e) => setEducationForm({ ...educationForm, institutionName: e.target.value })} />
              <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Degree" value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} />
              <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Field of study" value={educationForm.fieldOfStudy} onChange={(e) => setEducationForm({ ...educationForm, fieldOfStudy: e.target.value })} />
              <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Location" value={educationForm.location} onChange={(e) => setEducationForm({ ...educationForm, location: e.target.value })} />
              <input type="number" className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Order" value={educationForm.order} onChange={(e) => setEducationForm({ ...educationForm, order: e.target.value })} />
              <input className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Grade / CGPA" value={educationForm.grade} onChange={(e) => setEducationForm({ ...educationForm, grade: e.target.value })} />
              <input type="date" className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" value={educationForm.startDate} onChange={(e) => setEducationForm({ ...educationForm, startDate: e.target.value })} />
              <input type="date" className="rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" value={educationForm.endDate} onChange={(e) => setEducationForm({ ...educationForm, endDate: e.target.value })} disabled={educationForm.currentlyStudying} />
            </div>

            <AssetUploadField label="Institution logo" value={educationForm.institutionLogo} onChange={(value) => setEducationForm({ ...educationForm, institutionLogo: value })} hint="Used inside the education cards on the public site." />

            <label className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
              <input type="checkbox" checked={educationForm.currentlyStudying} onChange={(e) => setEducationForm({ ...educationForm, currentlyStudying: e.target.checked })} />
              Currently studying here
            </label>
            <textarea className="min-h-24 w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Short description" value={educationForm.description} onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })} />
            <textarea className="min-h-24 w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Coursework, one per line" value={educationForm.coursework} onChange={(e) => setEducationForm({ ...educationForm, coursework: e.target.value })} />
            <textarea className="min-h-24 w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 outline-none" placeholder="Educational achievements, one per line" value={educationForm.achievements} onChange={(e) => setEducationForm({ ...educationForm, achievements: e.target.value })} />

            <div className="flex gap-3">
              <button className="rounded-[22px] bg-[linear-gradient(135deg,#10b981,#0f766e)] px-5 py-4 text-sm font-semibold text-white transition hover:brightness-110">
                {editingEducationId ? 'Update Education' : 'Add Education'}
              </button>
              {editingEducationId ? <button type="button" onClick={resetEducation} className="rounded-[22px] border border-white/10 px-5 py-4 text-sm font-semibold text-slate-300 transition hover:bg-white/5">Cancel</button> : null}
            </div>
          </form>

          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={edu._id} className="flex items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                <div>
                  <p className="font-bold text-sm text-white">{edu.degree}</p>
                  <p className="text-xs text-slate-500">{edu.institutionName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderControls index={index} total={education.length} onMove={moveEducation} />
                  <button onClick={() => editEducation(edu)} className="text-cyan-300"><Pencil size={16} /></button>
                  <button onClick={() => deleteItem('edu', edu._id)} className="text-rose-500"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </JourneyCard>
      </div>
    </section>
  );
}
