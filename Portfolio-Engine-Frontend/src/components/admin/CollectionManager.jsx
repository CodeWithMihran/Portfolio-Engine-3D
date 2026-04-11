import React from "react";

// 🛠️ HELPER: Resolves nested strings like "threeJsConfig.position.x" into actual object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const defaultGetItemSummary = (item) =>
  item.title ||
  item.name ||
  item.role ||
  item.companyName ||
  item.institutionName ||
  item.issuer ||
  "Untitled Item";

const FieldInput = ({ field, value, onChange, onUploadImage, uploadLoading }) => {
  // Common styling for all inputs
  const baseStyles = "w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all placeholder:text-white/20";

  if (field.type === "textarea") {
    return (
      <textarea
        rows={field.rows || 4}
        value={value ?? ""}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.label}
        className={baseStyles}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={value ?? ""}
        onChange={(e) => onChange(field.name, e.target.value)}
        className={`${baseStyles} cursor-pointer`}
      >
        {field.options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-900">
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-4 py-3 cursor-pointer hover:bg-black/50 transition-colors">
        <span className="text-sm font-medium text-white/80">{field.label}</span>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(field.name, e.target.checked)}
          className="h-5 w-5 rounded border-white/10 bg-white/5 accent-cyan-400 transition-all"
        />
      </label>
    );
  }

  if (field.imageUpload) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
           <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={`${field.label} URL`}
            className={baseStyles}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white/5 p-3 rounded-xl border border-white/5">
          <label className="relative flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-cyan-500 px-4 py-2 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-400 active:scale-95">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onUploadImage(field.name, e)}
              disabled={uploadLoading}
            />
            {uploadLoading ? "Uploading..." : "Browse Files"}
          </label>
          <span className="text-[10px] uppercase tracking-widest text-white/30">Or paste URL above</span>
          {value && (
            <div className="ml-auto h-12 w-12 overflow-hidden rounded-md border border-white/20">
              <img src={value} alt="Preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type={field.type || "text"}
        value={value ?? ""}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.label}
        className={baseStyles}
      />
      {field.type === "number" && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-cyan-400/50 uppercase">Unit</span>
      )}
    </div>
  );
};

const CollectionManager = ({
  title,
  description,
  fields,
  form,
  editingId,
  items,
  loading,
  message,
  error,
  onFieldChange,
  onUploadImage,
  uploadLoading,
  onSubmit,
  onEdit,
  onMove,
  onCancelEdit,
  onDelete,
  renderItem,
  submitLabel = "Add Item",
}) => {
  // Organize fields into rows for a cleaner layout
  const groupedFields = fields.reduce((rows, field) => {
    const rowIndex = field.row || rows.length;
    if (!rows[rowIndex]) rows[rowIndex] = [];
    rows[rowIndex].push(field);
    return rows;
  }, []);

  return (
    <section className="group rounded-3xl border border-white/10 bg-[#050816]/50 p-8 backdrop-blur-sm transition-all hover:border-white/20">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
          <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
        </div>
        {description && <p className="mt-2 text-sm text-white/50">{description}</p>}
      </div>

      {message && (
        <div className="mb-6 animate-fade-in rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 animate-shake rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          {groupedFields.map((row, index) => (
            <div
              key={`${title}-row-${index}`}
              className={row.length > 1 ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "w-full"}
            >
              {row.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">
                    {field.label}
                  </label>
                  <FieldInput
                    field={field}
                    // ✅ FIXED: Use getNestedValue to handle "threeJsConfig.position.x"
                    value={field.name.includes('.') ? getNestedValue(form, field.name) : form[field.name]}
                    onChange={onFieldChange}
                    onUploadImage={onUploadImage}
                    uploadLoading={uploadLoading}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="group relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <span className="relative z-10">
              {loading ? "Processing Universe..." : editingId ? `Update ${title.slice(0, -1)}` : submitLabel}
            </span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-all group-hover:translate-x-full group-hover:opacity-100" />
          </button>

          {editingId && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Discard Changes
            </button>
          )}
        </div>
      </form>

      {/* ITEM LIST - Displaying existing records */}
      <div className="mt-12 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white/30">Existing Records</span>
          <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-white/40">{items.length} Total</span>
        </div>
        
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full border border-dashed border-white/20 mb-4" />
            <p className="text-sm text-white/30">The void is empty. Add something!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="group relative flex items-center justify-between gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:border-cyan-500/30 hover:bg-white/[0.04]"
              >
                <div className="min-w-0 flex-1">
                  {renderItem ? (
                    <div className="text-white">
                      <h4 className="font-bold text-lg">{renderItem(item).title}</h4>
                      <p className="text-sm text-white/50 truncate">{renderItem(item).subtitle}</p>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-bold text-lg text-white">{defaultGetItemSummary(item)}</h4>
                      {item.description && <p className="mt-1 text-sm text-white/40 line-clamp-1">{item.description}</p>}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="flex flex-col gap-1">
                    <button onClick={() => onMove(item, "up")} className="p-1.5 hover:text-cyan-400 text-white/30 transition-colors">▲</button>
                    <button onClick={() => onMove(item, "down")} className="p-1.5 hover:text-cyan-400 text-white/30 transition-colors">▼</button>
                  </div>
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg bg-white/5 px-4 py-2 text-xs font-bold text-white transition hover:bg-cyan-500 hover:text-slate-950"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="rounded-lg bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionManager;