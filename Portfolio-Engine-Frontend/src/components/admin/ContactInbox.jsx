const ContactInbox = ({ contacts, onMarkRead, onDelete, error }) => {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Contact Inbox</h2>
        <p className="mt-1 text-sm text-white/55">
          Messages submitted from the portfolio contact form.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        {contacts.length === 0 ? (
          <p className="text-sm text-white/50">No messages yet.</p>
        ) : (
          contacts.map((contact) => (
            <article
              key={contact._id}
              className="rounded-xl border border-white/10 bg-black/30 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold">{contact.name}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        contact.isRead
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {contact.isRead ? "Read" : "Unread"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-cyan-200">{contact.email}</p>
                  {contact.subject ? (
                    <p className="mt-3 text-sm font-medium text-white/85">
                      {contact.subject}
                    </p>
                  ) : null}
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/65">
                    {contact.message}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {!contact.isRead ? (
                    <button
                      type="button"
                      onClick={() => onMarkRead(contact._id)}
                      className="rounded-lg border border-emerald-400/20 px-3 py-2 text-sm text-emerald-300 transition hover:bg-emerald-500/10"
                    >
                      Mark read
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onDelete(contact._id)}
                    className="rounded-lg border border-red-400/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                  >
                    Delete
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
