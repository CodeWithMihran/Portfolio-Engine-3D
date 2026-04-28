import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { MailOpen, Trash2 } from 'lucide-react';

export default function Messages() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const res = await api.getMessages(); // Ensure you add this to services/api.js
    setMessages(res.data);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchMessages();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const markAsRead = async (id) => {
    await api.updateMessage(id, { status: 'read' });
    fetchMessages();
  };

  const deleteMsg = async (id) => {
    if (window.confirm('Delete this transmission forever?')) {
      await api.deleteMessage(id);
      fetchMessages();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Inbound <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Transmissions</span></h1>
      
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-0 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest font-mono">
            <tr>
              <th className="p-4">Status</th>
              <th className="p-4">Sender</th>
              <th className="p-4">Message Clip</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {messages.map((msg) => (
              <tr key={msg._id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${msg.isRead ? 'bg-slate-800 text-slate-500' : 'bg-blue-500/20 text-blue-400 animate-pulse'}`}>
                    {msg.isRead ? 'ARCHIVED' : 'NEW_INTEL'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="font-bold">{msg.name}</div>
                  <div className="text-xs text-slate-500">{msg.email}</div>
                </td>
                <td className="p-4 text-slate-400 text-sm max-w-xs truncate">
                  {msg.message}
                </td>
                <td className="p-4 text-xs font-mono text-slate-500">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => markAsRead(msg._id)} className="p-2 hover:text-blue-400"><MailOpen size={18} /></button>
                    <button onClick={() => deleteMsg(msg._id)} className="p-2 hover:text-rose-500"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
