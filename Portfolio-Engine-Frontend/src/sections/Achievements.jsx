const Achievements = ({ achievements, loading }) => {
  return (
    <section id="achievements" className="scroll-mt-28 py-24">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/75">
          Achievements
        </p>
        <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          Milestones worth putting on display.
        </h2>
      </div>

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-[2rem] border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {achievements.map((item) => (
            <article
              key={item._id}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-white/45">
                    {item.type || "Achievement"}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold">{item.title}</h3>
                </div>
                {item.position ? (
                  <span className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                    {item.position}
                  </span>
                ) : null}
              </div>

              {item.description ? (
                <p className="mt-4 leading-8 text-white/70">{item.description}</p>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                {item.issuer ? (
                  <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/65">
                    {item.issuer}
                  </span>
                ) : null}
                {item.certificateURL ? (
                  <a
                    href={item.certificateURL}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
                  >
                    View proof
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Achievements;
