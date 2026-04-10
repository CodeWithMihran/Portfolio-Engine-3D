const socialItems = [
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "twitter", label: "Twitter" },
  { key: "instagram", label: "Instagram" },
  { key: "website", label: "Website" },
];

const About = ({ profile, socialLinks }) => {
  const links = profile?.socialLinks || {};
  const visibleLinks =
    socialLinks ||
    socialItems
      .map((item) => ({ ...item, value: links[item.key] }))
      .filter((item) => item.value && item.value.trim());

  return (
    <section id="about" className="scroll-mt-28 py-24">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/8 to-white/5 p-8 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/75">
            About
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Built to feel like a digital space, not a static resume.
          </h2>
          {profile?.about ? (
            <p className="mt-6 text-base leading-8 text-white/70">
              {profile.about}
            </p>
          ) : null}
          {profile?.location || profile?.availability ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {profile?.location ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-5">
                  <p className="text-sm text-white/45">Location</p>
                  <p className="mt-2 text-lg font-semibold">
                    {profile.location}
                  </p>
                </div>
              ) : null}
              {profile?.availability ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-5">
                  <p className="text-sm text-white/45">Availability</p>
                  <p className="mt-2 text-lg font-semibold">
                    {profile.availability}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="grid gap-6">
          {profile?.bio ? (
            <div className="rounded-[2rem] border border-cyan-400/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(255,255,255,0.04))] p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-white/45">
                Positioning
              </p>
              <p className="mt-4 text-2xl font-semibold leading-10 text-white/90">
                {profile.bio}
              </p>
            </div>
          ) : null}

          {visibleLinks.length > 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/45">
                    Connect
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">Social presence</h3>
                </div>
                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200 sm:flex">
                  01
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {visibleLinks.map((item) => (
                  <a
                    key={item.key}
                    href={item.value}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-white/10 bg-slate-950/45 px-5 py-4 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-slate-950/60"
                  >
                    <p className="text-sm text-white/45">{item.label}</p>
                    <p className="mt-1 truncate font-medium text-white/85">
                      {item.value}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default About;
