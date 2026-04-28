import { useStore } from '../store/useStore';

const formatDate = (value, fallback = 'Present') => {
  if (!value) {
    return fallback;
  }

  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

function TimelineCard({ title, subtitle, date, description, extra }) {
  return (
    <div className="bento-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm text-blue-300">{subtitle}</p>
        </div>
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-slate-500">{date}</p>
      </div>
      {description && <p className="mt-4 leading-7 text-slate-400">{description}</p>}
      {extra}
    </div>
  );
}

export default function Journey() {
  const experience = useStore((state) => state.experience);
  const education = useStore((state) => state.education);

  return (
    <section id="journey" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-white">
          Experience & <span className="text-gradient">Education</span>
        </h2>
        <p className="mt-4 max-w-2xl text-slate-400">
          A timeline of the work, learning, and growth shaping this portfolio.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-white">Experience</h3>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500">
              {experience.length} entries
            </span>
          </div>
          {experience.length ? (
            experience.map((item) => (
              <TimelineCard
                key={item._id}
                title={item.role}
                subtitle={item.companyName}
                date={`${formatDate(item.startDate)} - ${item.currentlyWorking ? 'Present' : formatDate(item.endDate)}`}
                description={item.description}
                extra={
                  item.technologies?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wider text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : null
                }
              />
            ))
          ) : (
            <div className="bento-card text-slate-400">No experience records yet.</div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-white">Education</h3>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500">
              {education.length} entries
            </span>
          </div>
          {education.length ? (
            education.map((item) => (
              <TimelineCard
                key={item._id}
                title={item.degree}
                subtitle={`${item.institutionName}${item.fieldOfStudy ? `, ${item.fieldOfStudy}` : ''}`}
                date={`${formatDate(item.startDate)} - ${item.currentlyStudying ? 'Present' : formatDate(item.endDate)}`}
                description={item.description}
                extra={
                  item.grade ? (
                    <p className="mt-4 text-sm font-medium text-emerald-300">Grade: {item.grade}</p>
                  ) : null
                }
              />
            ))
          ) : (
            <div className="bento-card text-slate-400">No education records yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}
