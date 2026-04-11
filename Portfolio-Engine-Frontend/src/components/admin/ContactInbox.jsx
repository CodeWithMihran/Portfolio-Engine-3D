import React, { useState } from "react";

const ContactInbox = ({ contacts, onUpdateStatus, onDelete, error }) => {
  const [editingNotes, setEditingNotes] = useState(null); // Track which contact's notes are being edited
  const [tempNotes, setTempNotes] = useState("");

  const getStatusStyles = (status) => {
    switch (status) {
      case "new": return "bg-blue-500/15 text-blue-300 border-blue-500/20";
      case "read": return "bg-emerald-500/15 text-emerald-300 border-emerald-500/20";
      case "replied": return "bg-purple-500/15 text-purple-300 border-purple-500/20";
      case "archived": return "bg-white/10 text-white/40 border-white/5";
      default: return "bg-gray-500/15 text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-[#050816]/50 p-8 backdrop-blur-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Communications Hub</h2>
          <p className="mt-1 text-sm text-white/50">
            Manage inquiries and maintain follow-up notes for your network.
          </p>
        </div>
        <div className="rounded-full bg-white/5 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 border border-cyan-400/20">
          {contacts.filter(c => c.status === 'new').length} New Messages
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 animate-shake">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {contacts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-white/30 italic">Silence in the universe. No messages found.</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <article
              key={contact._id}
              className={`group relative rounded-2xl border transition-all duration-300 p-6 ${
                contact.status === 'new' 
                  ? "bg-cyan-500/[0.03] border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.05)]" 
                  : "bg-black/40 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* 📝 Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{contact.name}</h3>
                    <span className={`rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyles(contact.status)}`}>
                      {contact.status}
                    </span>
                    <span className="text-[10px] text-white/30 font-medium">
                      {formatDate(contact.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium text-cyan-400/80 mb-4">{contact.email}</p>
                  
                  <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Subject: {contact.subject || "No Subject"}</p>
                    <p className="text-sm leading-7 text-white/70 whitespace-pre-wrap">
                      {contact.message}
                    </p>
                  </div>

                  {/* 📓 Admin Notes Section */}
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Internal Admin Notes</h4>
                      {editingNotes !== contact._id && (
                        <button 
                          onClick={() => { setEditingNotes(contact._id); setTempNotes(contact.adminNotes || ""); }}
                          className="text-[10px] text-cyan-400 hover:underline"
                        >
                          {contact.adminNotes ? "Edit Notes" : "+ Add Note"}
                        </button>
                      )}
                    </div>

                    {editingNotes === contact._id ? (
                      <div className="space-y-3">
                        <textarea
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          className="w-full bg-black/60 border border-cyan-500/30 rounded-lg p-3 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-500"
                          placeholder="Write a private note about this contact..."
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { onUpdateStatus(contact._id, { adminNotes: tempNotes }); setEditingNotes(null); }}
                            className="bg-cyan-500 text-slate-950 px-3 py-1 rounded-md text-[10px] font-bold uppercase"
                          >
                            Save Note
                          </button>
                          <button 
                            onClick={() => setEditingNotes(null)}
                            className="bg-white/5 text-white/50 px-3 py-1 rounded-md text-[10px] font-bold uppercase hover:bg-white/10"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs italic text-white/40 leading-5">
                        {contact.adminNotes || "No internal notes yet. Use this space to track follow-ups."}
                      </p>
                    )}
                  </div>
                </div>

                {/* ⚡ Action Sidebar */}
                <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                  <select 
                    value={contact.status}
                    onChange={(e) => onUpdateStatus(contact._id, { status: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white outline-none hover:bg-white/10 cursor-pointer"
                  >
                    <option value="new" className="bg-slate-900">Mark as New</option>
                    <option value="read" className="bg-slate-900">Mark as Read</option>
                    <option value="replied" className="bg-slate-900">Mark as Replied</option>
                    <option value="archived" className="bg-slate-900">Archive</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => onDelete(contact._id)}
                    className="flex-1 lg:flex-none rounded-lg border border-red-500/20 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-400 transition hover:bg-red-500 hover:text-white"
                  >
                    Purge
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default ContactInbox;