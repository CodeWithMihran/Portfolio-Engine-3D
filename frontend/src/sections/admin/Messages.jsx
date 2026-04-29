import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Download,
  MailOpen,
  MessageSquareText,
  Search,
  Send,
  Smartphone,
  Trash2,
} from 'lucide-react';
import { api } from '../../services/api';

const STATUS_OPTIONS = ['all', 'new', 'read', 'replied', 'archived'];

function StatCard({ label, value, tone = 'cyan' }) {
  const tones = {
    cyan: 'border-cyan-300/12 bg-cyan-400/10 text-cyan-100',
    orange: 'border-orange-300/12 bg-orange-400/10 text-orange-100',
    emerald: 'border-emerald-300/12 bg-emerald-400/10 text-emerald-100',
    violet: 'border-violet-300/12 bg-violet-400/10 text-violet-100',
  };

  return (
    <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,14,28,0.92),rgba(9,17,31,0.78))] p-5 shadow-[0_18px_50px_rgba(2,6,23,0.24)] backdrop-blur-xl">
      <p className="text-[10px] font-mono uppercase tracking-[0.26em] text-slate-500">{label}</p>
      <div className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-mono uppercase tracking-[0.22em] ${tones[tone]}`}>
        Live metric
      </div>
      <p className="mt-5 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [messagesResponse, statsResponse] = await Promise.all([
        api.getMessages({
          status: statusFilter,
          search: search.trim() || undefined,
        }),
        api.getMessageStats(),
      ]);
      setMessages(messagesResponse.data);
      setStats(statsResponse.data);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = window.setTimeout(fetchData, 180);
    return () => window.clearTimeout(timer);
  }, [fetchData]);

  const unreadCount = useMemo(
    () => messages.filter((message) => !message.isRead || message.status === 'new').length,
    [messages]
  );

  const updateMessage = async (id, payload) => {
    setSavingId(id);
    try {
      await api.updateMessage(id, payload);
      await fetchData();
    } finally {
      setSavingId(null);
    }
  };

  const deleteMsg = async (id) => {
    if (!window.confirm('Delete this message permanently?')) {
      return;
    }
    await api.deleteMessage(id);
    await fetchData();
  };

  const exportMessages = async () => {
    const response = await api.exportMessages();
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-messages.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">Admin section</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Message Intelligence</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Track message status, watch unread volume, filter conversations quickly, and export your inbox when needed.
          </p>
        </div>
        <button
          onClick={exportMessages}
          className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/15"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total messages" value={stats?.total ?? 0} tone="cyan" />
        <StatCard label="Unread now" value={stats?.unread ?? unreadCount} tone="orange" />
        <StatCard label="Replied" value={stats?.replied ?? 0} tone="emerald" />
        <StatCard label="Last 7 days" value={stats?.last7Days ?? 0} tone="violet" />
      </div>

      <div className="flex flex-col gap-4 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,14,28,0.92),rgba(9,17,31,0.78))] p-5 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-4 py-2 text-xs font-mono uppercase tracking-[0.22em] transition ${
                statusFilter === status
                  ? 'border border-cyan-300/20 bg-cyan-400/12 text-cyan-100'
                  : 'border border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 lg:min-w-[320px]">
          <Search size={16} className="text-slate-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search sender, subject, or message..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {messages.map((msg) => {
          const device = /mobile|android|iphone|ipad/i.test(msg.userAgent || '') ? 'Mobile' : 'Desktop';
          const statusTone = {
            new: 'border-cyan-300/18 bg-cyan-400/10 text-cyan-100',
            read: 'border-slate-400/18 bg-white/5 text-slate-200',
            replied: 'border-emerald-300/18 bg-emerald-400/10 text-emerald-100',
            archived: 'border-orange-300/18 bg-orange-400/10 text-orange-100',
          }[msg.status] || 'border-white/10 bg-white/5 text-slate-200';

          return (
            <article key={msg._id} className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.9),rgba(8,15,30,0.72))] p-5 shadow-[0_18px_50px_rgba(2,6,23,0.24)] backdrop-blur-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">{msg.name}</h2>
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] ${statusTone}`}>
                      {msg.status}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-400">
                      {device}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                    <span>{msg.email}</span>
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="rounded-[22px] border border-white/8 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-200">
                    {msg.message}
                  </div>

                  <textarea
                    value={msg.adminNotes || ''}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setMessages((current) =>
                        current.map((item) =>
                          item._id === msg._id ? { ...item, adminNotes: nextValue } : item
                        )
                      );
                    }}
                    onBlur={(event) => updateMessage(msg._id, { adminNotes: event.target.value })}
                    placeholder="Add private notes for follow-up..."
                    className="min-h-24 w-full rounded-[22px] border border-white/10 bg-slate-950/85 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/30"
                  />
                </div>

                <div className="flex flex-col gap-3 lg:min-w-[220px]">
                  <select
                    value={msg.status}
                    disabled={savingId === msg._id}
                    onChange={(event) => updateMessage(msg._id, { status: event.target.value })}
                    className="rounded-[20px] border border-white/10 bg-slate-950/85 px-4 py-3 text-sm text-white outline-none"
                  >
                    {STATUS_OPTIONS.filter((item) => item !== 'all').map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <a
                    href={`mailto:${msg.email}?subject=Re:${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                    className="inline-flex items-center justify-center gap-2 rounded-[20px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/15"
                  >
                    <Send size={16} />
                    Reply
                  </a>

                  <button
                    onClick={() => updateMessage(msg._id, { status: 'read' })}
                    className="inline-flex items-center justify-center gap-2 rounded-[20px] border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15"
                  >
                    <MailOpen size={16} />
                    Mark Read
                  </button>

                  <button
                    onClick={() => deleteMsg(msg._id)}
                    className="inline-flex items-center justify-center gap-2 rounded-[20px] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/15"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {!loading && !messages.length ? (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-400">
            <MessageSquareText size={28} className="mx-auto mb-4 text-slate-500" />
            No messages match the current filters.
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,14,28,0.92),rgba(9,17,31,0.78))] p-5 backdrop-blur-xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.26em] text-slate-500">Unread pulse</p>
          <p className="mt-4 text-3xl font-black text-white">{stats?.unread ?? unreadCount}</p>
          <p className="mt-2 text-sm text-slate-400">Messages that still need attention right now.</p>
        </div>
        <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,14,28,0.92),rgba(9,17,31,0.78))] p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Smartphone size={16} className="text-cyan-300" />
            Device mix
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Mobile visitors: <span className="font-semibold text-white">{stats?.mobile ?? 0}</span>
            <br />
            Desktop visitors: <span className="font-semibold text-white">{stats?.desktop ?? 0}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
