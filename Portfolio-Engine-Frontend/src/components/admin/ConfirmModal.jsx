const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1220] p-6 text-white shadow-2xl">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-white/65">{description}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-lg bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-400"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-lg border border-white/15 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
