import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { api } from '../../services/api';
import { Briefcase, GraduationCap, Pencil, Plus, Trash2 } from 'lucide-react';

const EMPTY_EXPERIENCE = {
  companyName: '',
  role: '',
  employmentType: 'internship',
  location: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  description: '',
  responsibilities: '',
  technologies: '',
};

const EMPTY_EDUCATION = {
  institutionName: '',
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
};

export default function JourneyManagement() {
  const experience = useStore((state) => state.experience);
  const education = useStore((state) => state.education);
  const fetchAllData = useStore((state) => state.fetchAllData);
  const [experienceForm, setExperienceForm] = useState(EMPTY_EXPERIENCE);
  const [educationForm, setEducationForm] = useState(EMPTY_EDUCATION);
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [editingEducationId, setEditingEducationId] = useState(null);

  const deleteItem = async (type, id) => {
    if (type === 'exp') await api.deleteExperience(id);
    else await api.deleteEducation(id);
    fetchAllData();
  };

  const saveExperience = async (e) => {
    e.preventDefault();
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
    };

    if (editingExperienceId) {
      await api.updateExperience(editingExperienceId, payload);
    } else {
      await api.createExperience(payload);
    }

    setEditingExperienceId(null);
    setExperienceForm(EMPTY_EXPERIENCE);
    fetchAllData();
  };

  const saveEducation = async (e) => {
    e.preventDefault();
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
    };

    if (editingEducationId) {
      await api.updateEducation(editingEducationId, payload);
    } else {
      await api.createEducation(payload);
    }

    setEditingEducationId(null);
    setEducationForm(EMPTY_EDUCATION);
    fetchAllData();
  };

  const editExperience = (item) => {
    setEditingExperienceId(item._id);
    setExperienceForm({
      companyName: item.companyName || '',
      role: item.role || '',
      employmentType: item.employmentType || 'internship',
      location: item.location || '',
      startDate: item.startDate?.slice(0, 10) || '',
      endDate: item.endDate?.slice(0, 10) || '',
      currentlyWorking: Boolean(item.currentlyWorking),
      description: item.description || '',
      responsibilities: (item.responsibilities || []).join('\n'),
      technologies: (item.technologies || []).join(', '),
    });
  };

  const editEducation = (item) => {
    setEditingEducationId(item._id);
    setEducationForm({
      institutionName: item.institutionName || '',
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
    });
  };

  return (
    <div className="max-w-6xl space-y-8">
      <h1 className="text-3xl font-bold mb-8">TIMELINE_CONTROL</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center gap-2 font-bold"><Briefcase size={18}/> Experience</h2>
            <button
              type="button"
              onClick={() => {
                setEditingExperienceId(null);
                setExperienceForm(EMPTY_EXPERIENCE);
              }}
              className="inline-flex items-center gap-2 text-xs bg-blue-500/10 text-blue-400 px-3 py-2 rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-all"
            >
              <Plus size={14} /> New
            </button>
          </div>
          <form onSubmit={saveExperience} className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-md">
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" placeholder="Company" value={experienceForm.companyName} onChange={(e) => setExperienceForm({ ...experienceForm, companyName: e.target.value })} />
              <input className="rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" placeholder="Role" value={experienceForm.role} onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })} />
              <select className="rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" value={experienceForm.employmentType} onChange={(e) => setExperienceForm({ ...experienceForm, employmentType: e.target.value })}>
                {['full-time', 'part-time', 'internship', 'freelance'].map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <input className="rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" placeholder="Location" value={experienceForm.location} onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })} />
              <input type="date" className="rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" value={experienceForm.startDate} onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })} />
              <input type="date" className="rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" value={experienceForm.endDate} onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })} disabled={experienceForm.currentlyWorking} />
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input type="checkbox" checked={experienceForm.currentlyWorking} onChange={(e) => setExperienceForm({ ...experienceForm, currentlyWorking: e.target.checked })} />
              Currently working here
            </label>
            <textarea className="min-h-24 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" placeholder="Short description" value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} />
            <textarea className="min-h-24 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" placeholder="Responsibilities, one per line" value={experienceForm.responsibilities} onChange={(e) => setExperienceForm({ ...experienceForm, responsibilities: e.target.value })} />
            <input className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" placeholder="Technologies, comma separated" value={experienceForm.technologies} onChange={(e) => setExperienceForm({ ...experienceForm, technologies: e.target.value })} />
            <div className="flex gap-3">
              <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
                {editingExperienceId ? 'Update Experience' : 'Add Experience'}
              </button>
              {editingExperienceId ? (
                <button type="button" onClick={() => { setEditingExperienceId(null); setExperienceForm(EMPTY_EXPERIENCE); }} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5">
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
          {experience.map(exp => (
            <div key={exp._id} className="group flex justify-between rounded-3xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
              <div>
                <p className="font-bold text-sm">{exp.role}</p>
                <p className="text-xs text-slate-500">{exp.companyName}</p>
              </div>
              <div className="flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => editExperience(exp)} className="text-cyan-300"><Pencil size={16}/></button>
                <button onClick={() => deleteItem('exp', exp._id)} className="text-rose-500"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center gap-2 font-bold"><GraduationCap size={18}/> Education</h2>
            <button
              type="button"
              onClick={() => {
                setEditingEducationId(null);
                setEducationForm(EMPTY_EDUCATION);
              }}
              className="inline-flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-400 px-3 py-2 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
            >
              <Plus size={14} /> New
            </button>
          </div>
          <form onSubmit={saveEducation} className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-md">
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" placeholder="Institution" value={educationForm.institutionName} onChange={(e) => setEducationForm({ ...educationForm, institutionName: e.target.value })} />
              <input className="rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" placeholder="Degree" value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} />
              <input className="rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" placeholder="Field of study" value={educationForm.fieldOfStudy} onChange={(e) => setEducationForm({ ...educationForm, fieldOfStudy: e.target.value })} />
              <input className="rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" placeholder="Location" value={educationForm.location} onChange={(e) => setEducationForm({ ...educationForm, location: e.target.value })} />
              <input type="date" className="rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" value={educationForm.startDate} onChange={(e) => setEducationForm({ ...educationForm, startDate: e.target.value })} />
              <input type="date" className="rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" value={educationForm.endDate} onChange={(e) => setEducationForm({ ...educationForm, endDate: e.target.value })} disabled={educationForm.currentlyStudying} />
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input type="checkbox" checked={educationForm.currentlyStudying} onChange={(e) => setEducationForm({ ...educationForm, currentlyStudying: e.target.checked })} />
              Currently studying here
            </label>
            <input className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" placeholder="Grade / CGPA" value={educationForm.grade} onChange={(e) => setEducationForm({ ...educationForm, grade: e.target.value })} />
            <textarea className="min-h-24 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" placeholder="Short description" value={educationForm.description} onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })} />
            <textarea className="min-h-24 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" placeholder="Coursework, one per line" value={educationForm.coursework} onChange={(e) => setEducationForm({ ...educationForm, coursework: e.target.value })} />
            <textarea className="min-h-24 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none" placeholder="Educational achievements, one per line" value={educationForm.achievements} onChange={(e) => setEducationForm({ ...educationForm, achievements: e.target.value })} />
            <div className="flex gap-3">
              <button className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
                {editingEducationId ? 'Update Education' : 'Add Education'}
              </button>
              {editingEducationId ? (
                <button type="button" onClick={() => { setEditingEducationId(null); setEducationForm(EMPTY_EDUCATION); }} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5">
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
          {education.map(edu => (
            <div key={edu._id} className="group flex justify-between rounded-3xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
              <div>
                <p className="font-bold text-sm">{edu.degree}</p>
                <p className="text-xs text-slate-500">{edu.institutionName}</p>
              </div>
              <div className="flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => editEducation(edu)} className="text-cyan-300"><Pencil size={16}/></button>
                <button onClick={() => deleteItem('edu', edu._id)} className="text-rose-500"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
