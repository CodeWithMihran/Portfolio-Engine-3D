const categoryTitles = {
  frontend: "Frontend Systems",
  backend: "Backend Logic",
  database: "Data Layer",
  programming: "Core Languages",
  tools: "Workflow Tools",
  other: "Other Capabilities",
};

const Skills = ({ skills, loading }) => {
  const groupedSkills = skills.reduce((accumulator, skill) => {
    const category = skill.category || "other";

    if (!accumulator[category]) {
      accumulator[category] = [];
    }

    accumulator[category].push(skill);
    return accumulator;
  }, {});

  return (
    <section id="skills" className="scroll-mt-28 py-24">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/75">
            Skills
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            A stack designed for immersive interfaces and clean systems.
          </h2>
        </div>
        <p className="max-w-xl text-white/60">
          Skills are grouped dynamically from MongoDB, which makes this section
          ready for growth as your work becomes more specialized.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-[2rem] border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : Object.keys(groupedSkills).length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-10 text-center text-white/60">
          No skills added yet. Add them from the admin panel to make this
          section come alive.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {Object.entries(groupedSkills).map(([category, items]) => (
            <div
              key={category}
              className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 backdrop-blur"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/40">
                    Category
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">
                    {categoryTitles[category] || category}
                  </h3>
                </div>
                <div className="rounded-2xl bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200">
                  {items.length} skills
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {items.map((skill) => (
                  <div
                    key={skill._id}
                    className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <p className="font-semibold text-white">{skill.name}</p>
                      <span className="text-sm text-white/50">
                        {skill.proficiency || 0}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300"
                        style={{ width: `${skill.proficiency || 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Skills;
