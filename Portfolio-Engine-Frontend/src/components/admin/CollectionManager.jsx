const defaultGetItemSummary = (item) =>
  item.title ||
  item.name ||
  item.role ||
  item.companyName ||
  item.institutionName ||
  item.issuer ||
  "Untitled";

const FieldInput = ({ field, value, onChange, onUploadImage, uploadLoading }) => {
  if (field.type === "textarea") {
    return (
      <textarea
        rows={field.rows || 4}
        value={value}
        onChange={(event) => onChange(field.name, event.target.value)}
        placeholder={field.label}
        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={value}
        onChange={(event) => onChange(field.name, event.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
      >
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-4 py-3">
        <span>{field.label}</span>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(field.name, event.target.checked)}
          className="h-4 w-4 accent-cyan-400"
        />
      </label>
    );
  }

  if (field.imageUpload) {
    return (
      <div className="space-y-3">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(field.name, event.target.value)}
          placeholder={field.label}
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/15">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => onUploadImage(field.name, event)}
            />
            {uploadLoading ? "Uploading..." : "Upload image"}
          </label>
          {value ? (
            <img
              src={value}
              alt={field.label}
              className="h-20 w-20 rounded-lg border border-white/10 object-cover"
            />
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <input
      type={field.type || "text"}
      value={value}
      onChange={(event) => onChange(field.name, event.target.value)}
      placeholder={field.label}
      className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
    />
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
  const groupedFields = fields.reduce((rows, field) => {
    const rowIndex = field.row || rows.length;

    if (!rows[rowIndex]) {
      rows[rowIndex] = [];
    }

    rows[rowIndex].push(field);
    return rows;
  }, []);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-white/55">{description}</p>
        ) : null}
      </div>

      {message ? (
        <div className="mb-4 rounded-lg bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        {groupedFields.map((row, index) => (
          <div
            key={`${title}-row-${index}`}
            className={row.length > 1 ? "grid gap-4 md:grid-cols-2" : ""}
          >
            {row.map((field) => (
              <FieldInput
                key={field.name}
                field={field}
                value={form[field.name]}
                onChange={onFieldChange}
                onUploadImage={onUploadImage}
                uploadLoading={uploadLoading}
              />
            ))}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading
            ? "Saving..."
            : editingId
              ? `Update ${title.slice(0, -1) || title}`
              : submitLabel}
        </button>
        {editingId ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-full rounded-lg border border-white/15 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Cancel Edit
          </button>
        ) : null}
      </form>

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-white/50">No items added yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border border-white/10 bg-black/30 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {renderItem ? (
                    renderItem(item)
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold">
                        {defaultGetItemSummary(item)}
                      </h3>
                      {item.description ? (
                        <p className="mt-2 text-sm text-white/65">
                          {item.description}
                        </p>
                      ) : null}
                    </>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onMove(item, "up")}
                      className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={() => onMove(item, "down")}
                      className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
                    >
                      Down
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="rounded-lg border border-cyan-400/20 px-3 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/10"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item._id)}
                    className="rounded-lg border border-red-400/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CollectionManager;
