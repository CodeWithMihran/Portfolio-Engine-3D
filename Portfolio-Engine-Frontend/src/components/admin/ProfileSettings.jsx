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
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Profile Content</h2>
        <p className="mt-1 text-sm text-white/55">
          Control hero content, social links, and which sections appear on the
          main portfolio.
        </p>
      </div>

      {profileMessage ? (
        <div className="mb-4 rounded-lg bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">
          {profileMessage}
        </div>
      ) : null}

      {profileError ? (
        <div className="mb-4 rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-300">
          {profileError}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="fullName"
            placeholder="Full name"
            value={profileForm.fullName}
            onChange={onProfileChange}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
          />
          <input
            name="title"
            placeholder="Title"
            value={profileForm.title}
            onChange={onProfileChange}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
          />
        </div>

        <textarea
          name="bio"
          placeholder="Short bio"
          value={profileForm.bio}
          onChange={onProfileChange}
          rows="3"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
        />

        <textarea
          name="about"
          placeholder="Detailed about section"
          value={profileForm.about}
          onChange={onProfileChange}
          rows="5"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
        />

        <div className="space-y-3">
          <input
            name="profileImage"
            placeholder="Profile image URL"
            value={profileForm.profileImage}
            onChange={onProfileChange}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/15">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onProfileImageUpload}
              />
              {profileUploadLoading ? "Uploading..." : "Upload profile image"}
            </label>
            {profileForm.profileImage ? (
              <img
                src={profileForm.profileImage}
                alt="Profile preview"
                className="h-20 w-20 rounded-xl border border-white/10 object-cover"
              />
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="email"
            placeholder="Public email"
            value={profileForm.email}
            onChange={onProfileChange}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={profileForm.phone}
            onChange={onProfileChange}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
          />
          <input
            name="location"
            placeholder="Location"
            value={profileForm.location}
            onChange={onProfileChange}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
          />
          <input
            name="availability"
            placeholder="Availability"
            value={profileForm.availability}
            onChange={onProfileChange}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
          />
        </div>

        <input
          name="tagline"
          placeholder="Tagline"
          value={profileForm.tagline}
          onChange={onProfileChange}
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
        />

        <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
          <h3 className="font-semibold">Social Links</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {socialFields.map((field) => (
              <input
                key={field.key}
                placeholder={`${field.label} URL`}
                value={profileForm.socialLinks[field.key]}
                onChange={(event) =>
                  onSocialChange(field.key, event.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
              />
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
          <h3 className="font-semibold">Section Visibility</h3>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sectionFields.map((field) => (
              <label
                key={field.key}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3"
              >
                <span>{field.label}</span>
                <input
                  type="checkbox"
                  checked={profileForm.sectionVisibility[field.key]}
                  onChange={() => onVisibilityToggle(field.key)}
                  className="h-4 w-4 accent-cyan-400"
                />
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={profileLoading}
          className="w-full rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {profileLoading ? "Saving profile..." : "Save Profile Settings"}
        </button>
      </form>
    </section>
  );
};

export default ProfileSettings;
