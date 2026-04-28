import { useStore } from '../../store/useStore';
import { api } from '../../services/api';
import { Briefcase, GraduationCap, Trash2 } from 'lucide-react';

export default function JourneyManagement() {
  const experience = useStore((state) => state.experience);
  const education = useStore((state) => state.education);
  const fetchAllData = useStore((state) => state.fetchAllData);

  const deleteItem = async (type, id) => {
    if (type === 'exp') await api.deleteExperience(id);
    else await api.deleteEducation(id);
    fetchAllData();
  };

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">TIMELINE_CONTROL</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Experience Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center gap-2 font-bold"><Briefcase size={18}/> Experience</h2>
            <button className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-all">+ Add</button>
          </div>
          {experience.map(exp => (
            <div key={exp._id} className="bento-card p-4 flex justify-between group">
              <div>
                <p className="font-bold text-sm">{exp.role}</p>
                <p className="text-xs text-slate-500">{exp.companyName}</p>
              </div>
              <button onClick={() => deleteItem('exp', exp._id)} className="opacity-0 group-hover:opacity-100 text-rose-500 transition-opacity"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>

        {/* Education Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center gap-2 font-bold"><GraduationCap size={18}/> Education</h2>
            <button className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">+ Add</button>
          </div>
          {education.map(edu => (
            <div key={edu._id} className="bento-card p-4 flex justify-between group">
              <div>
                <p className="font-bold text-sm">{edu.degree}</p>
                <p className="text-xs text-slate-500">{edu.institutionName}</p>
              </div>
              <button onClick={() => deleteItem('edu', edu._id)} className="opacity-0 group-hover:opacity-100 text-rose-500 transition-opacity"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
