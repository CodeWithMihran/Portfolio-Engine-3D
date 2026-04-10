const Certificates = ({ certificates, loading }) => {
  return (
    <section id="certificates" className="scroll-mt-28 py-24">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/75">
          Certificates
        </p>
        <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          Verified learning and professional growth.
        </h2>
      </div>

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-[2rem] border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {certificates.map((item) => (
            <article
              key={item._id}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">
                {item.issuer}
              </p>
              <h3 className="mt-3 text-2xl font-bold">{item.title}</h3>
              {item.description ? (
                <p className="mt-4 leading-8 text-white/70">{item.description}</p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3">
                {item.credentialURL ? (
                  <a
                    href={item.credentialURL}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
                  >
                    Verify
                  </a>
                ) : null}
                {item.credentialId ? (
                  <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/65">
                    ID: {item.credentialId}
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

export default Certificates;
