const Education = ({ educations, loading }) => {
  return (
    <section id="education" className="scroll-mt-28 py-24">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/75">
          Education
        </p>
        <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          The academic foundation behind the work.
        </h2>
      </div>

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-[2rem] border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {educations.map((item) => (
            <article
              key={item._id}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">
                {item.institutionName}
              </p>
              <h3 className="mt-3 text-2xl font-bold">{item.degree}</h3>
              <p className="mt-2 text-cyan-200">{item.fieldOfStudy}</p>

              {item.description ? (
                <p className="mt-4 leading-8 text-white/70">{item.description}</p>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/55">
                {item.location ? (
                  <span className="rounded-full border border-white/10 px-4 py-2">
                    {item.location}
                  </span>
                ) : null}
                {item.grade ? (
                  <span className="rounded-full border border-white/10 px-4 py-2">
                    {item.grade}
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Education;
