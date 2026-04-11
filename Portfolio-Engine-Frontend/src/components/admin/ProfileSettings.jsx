import React from "react";

const ProfileSettings = ({
  profileForm,
  profileMessage,
  profileError,
  profileLoading,
  profileUploadLoading,
  sectionFields,
  socialFields,
  onProfileChange,
  onProfileImageUpload,
  onSocialChange,
  onVisibilityToggle,
  onSubmit,
}) => {
  // Helper for nested theme updates (e.g., theme.primaryColor)
  const handleThemeChange = (e) => {
    const { name, value } = e.target;
    const field = name.split(".")[1];
    onProfileChange({
      target: {
        name: "theme",
        value: { ...profileForm.theme, [field]: value },
      },
    });
  };

  const inputStyles = "w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400 transition-all placeholder:text-white/20 text-sm";
  const sectionLabel = "text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/70 mb-3 block";

  return (
    <section className="rounded-3xl border border-white/10 bg-[#050816]/50 p-8 backdrop-blur-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Identity & Universe Settings</h2>
        <p className="mt-1 text-sm text-white/50">
          Customize your global presence, 3D environment, and section visibility.
        </p>
      </div>

      {profileMessage && (
        <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
          {profileMessage}
        </div>
      )}

      {profileError && (
        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {profileError}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-10">
        
        {/* --- SECTION 1: CORE IDENTITY --- */}
        <div className="space-y-4">
          <span className={sectionLabel}>Core Identity</span>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="fullName"
              placeholder="Full name"
              value={profileForm.fullName}
              onChange={onProfileChange}
              className={inputStyles}
            />
            <input
              name="title"
              placeholder="Professional Title (e.g. AI Researcher)"
              value={profileForm.title}
              onChange={onProfileChange}
              className={inputStyles}
            />
          </div>
          <textarea
            name="bio"
            placeholder="Short tagline bio"
            value={profileForm.bio}
            onChange={onProfileChange}
            rows="2"
            className={inputStyles}
          />
        </div>

        {/* --- SECTION 2: 3D UNIVERSE THEME --- */}
        <div className="space-y-4 p-6 rounded-2xl bg-cyan-500/[0.03] border border-cyan-500/10">
          <span className={sectionLabel}>3D Universe Environment</span>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs text-white/50">Planet Glow Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  name="theme.primaryColor"
                  value={profileForm.theme?.primaryColor || "#67e8f9"}
                  onChange={handleThemeChange}
                  className="h-10 w-10 cursor-pointer rounded bg-transparent"
                />
                <input 
                   type="text" 
                   value={profileForm.theme?.primaryColor} 
                   readOnly 
                   className="text-[10px] text-white/40 bg-transparent uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/50">Space Background</label>
              <input
                type="color"
                name="theme.backgroundColor"
                value={profileForm.theme?.backgroundColor || "#050816"}
                onChange={handleThemeChange}
                className="h-10 w-10 cursor-pointer rounded bg-transparent"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-xs text-white/50 block">Sun Intensity (Ambient Light: {profileForm.theme?.ambientLightIntensity || 0.75})</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                name="theme.ambientLightIntensity"
                value={profileForm.theme?.ambientLightIntensity || 0.75}
                onChange={handleThemeChange}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <label className="text-xs text-white/50 mb-1 block">Skybox / Stars Texture URL</label>
            <input
              name="theme.skyboxUrl"
              placeholder="Link to an HDR or Starfield image"
              value={profileForm.theme?.skyboxUrl || ""}
              onChange={handleThemeChange}
              className={inputStyles}
            />
          </div>
        </div>

        {/* --- SECTION 3: MEDIA & SOCIALS --- */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <span className={sectionLabel}>Profile Imagery</span>
            <div className="flex gap-4 items-center bg-black/20 p-4 rounded-xl border border-white/5">
              <div className="relative h-20 w-20 shrink-0">
                <img
                  src={profileForm.profileImage || "https://via.placeholder.com/150"}
                  alt="Preview"
                  className="h-full w-full rounded-full object-cover border-2 border-cyan-400/30"
                />
                {profileUploadLoading && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-[8px] uppercase">Wait...</div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  name="profileImage"
                  placeholder="Paste URL"
                  value={profileForm.profileImage}
                  onChange={onProfileChange}
                  className="w-full bg-transparent border-b border-white/10 text-xs py-1 outline-none"
                />
                <label className="inline-block cursor-pointer text-[10px] font-bold text-cyan-400 uppercase tracking-tighter hover:text-white">
                  <input type="file" className="hidden" onChange={onProfileImageUpload} />
                  Change Avatar
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className={sectionLabel}>Social Network</span>
            <div className="grid gap-3 sm:grid-cols-2">
              {socialFields.map((field) => (
                <div key={field.key} className="relative">
                   <input
                    placeholder={field.label}
                    value={profileForm.socialLinks[field.key]}
                    onChange={(e) => onSocialChange(field.key, e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs outline-none focus:border-cyan-400"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- SECTION 4: VISIBILITY CONTROLS --- */}
        <div className="space-y-4">
          <span className={sectionLabel}>Module Visibility</span>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {sectionFields.map((field) => (
              <button
                key={field.key}
                type="button"
                onClick={() => onVisibilityToggle(field.key)}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all ${
                  profileForm.sectionVisibility[field.key]
                    ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-200"
                    : "bg-white/5 border-white/5 text-white/30 grayscale"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">{field.label}</span>
                <div className={`h-1.5 w-1.5 rounded-full ${profileForm.sectionVisibility[field.key] ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-white/10'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* --- SUBMIT --- */}
        <div className="pt-6 sticky bottom-0 bg-[#050816]/80 backdrop-blur-md py-4 border-t border-white/5">
          <button
            type="submit"
            disabled={profileLoading}
            className="w-full rounded-xl bg-cyan-500 px-6 py-4 font-black uppercase tracking-[0.3em] text-slate-950 transition-all hover:bg-cyan-400 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {profileLoading ? "Updating Reality..." : "Save All Universe Settings"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProfileSettings;