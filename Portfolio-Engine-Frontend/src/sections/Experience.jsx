const Experience = ({ experiences, loading }) => {
  return (
    <section id="experience" className="scroll-mt-28 py-24">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/75">
            Experience
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Building products through real delivery, not just demos.
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-[2rem] border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((item) => (
            <article
              key={item._id}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-white/45">
                    {item.employmentType || "Experience"}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">{item.role}</h3>
                  <p className="mt-1 text-lg text-cyan-200">
                    {item.companyName}
                  </p>
                </div>
                <div className="text-sm text-white/55">
                  {item.location ? <p>{item.location}</p> : null}
                  <p className="mt-1">
                    {item.startDate
                      ? new Date(item.startDate).toLocaleDateString()
                      : ""}
                    {item.endDate
                      ? ` - ${new Date(item.endDate).toLocaleDateString()}`
                      : item.currentlyWorking
                        ? " - Present"
                        : ""}
                  </p>
                </div>
              </div>

              {item.description ? (
                <p className="mt-5 leading-8 text-white/70">{item.description}</p>
              ) : null}

              {item.responsibilities?.length ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  {item.responsibilities.map((responsibility, index) => (
                    <span
                      key={`${item._id}-responsibility-${index}`}
                      className="rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-sm text-white/75"
                    >
                      {responsibility}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Experience;
