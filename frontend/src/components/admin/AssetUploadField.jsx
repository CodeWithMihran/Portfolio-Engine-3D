import { useId, useState } from 'react';
import { ImagePlus, Link2, LoaderCircle, Upload, X } from 'lucide-react';
import { api } from '../../services/api';

export default function AssetUploadField({
  label,
  value,
  onChange,
  hint = 'Paste a URL or upload an image.',
  accept = 'image/*',
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const previewVisible = Boolean(value);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError('');
    setUploading(true);

    try {
      const response = await api.uploadImage(file);
      onChange(response.data.imageUrl);
    } catch (uploadError) {
      setError(uploadError?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={inputId} className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">
          {label}
        </label>
        {previewVisible ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-rose-200 transition hover:bg-rose-400/15"
          >
            <X size={12} />
            Clear
          </button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,12,24,0.9),rgba(8,15,30,0.78))] shadow-[0_18px_45px_rgba(2,6,23,0.22)]">
        <div className="grid gap-0 lg:grid-cols-[0.94fr_1.06fr]">
          <div className="flex min-h-[180px] items-center justify-center border-b border-white/8 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.86),rgba(2,6,23,0.86))] p-4 lg:min-h-[200px] lg:border-b-0 lg:border-r">
            {previewVisible ? (
              <img
                src={value}
                alt={label}
                className="max-h-40 w-full rounded-[20px] border border-white/10 object-cover shadow-[0_14px_35px_rgba(2,6,23,0.28)] lg:max-h-48"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-center text-slate-400">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                  <ImagePlus size={22} />
                </div>
                <p className="text-sm font-semibold text-slate-200">No asset selected yet</p>
                <p className="max-w-[16rem] text-xs leading-6 text-slate-500">{hint}</p>
              </div>
            )}
          </div>

          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <label htmlFor={`${inputId}-url`} className="text-[10px] font-mono uppercase tracking-[0.24em] text-slate-500">
                Direct URL
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3">
                <Link2 size={16} className="text-slate-500" />
                <input
                  id={`${inputId}-url`}
                  type="url"
                  value={value}
                  onChange={(event) => onChange(event.target.value)}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  placeholder="https://example.com/image.png"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor={inputId} className="text-[10px] font-mono uppercase tracking-[0.24em] text-slate-500">
                Upload image
              </label>
              <label
                htmlFor={inputId}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed border-cyan-300/18 bg-cyan-400/8 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-300/28 hover:bg-cyan-400/12"
              >
                <span className="inline-flex items-center gap-2">
                  {uploading ? <LoaderCircle size={16} className="animate-spin text-cyan-200" /> : <Upload size={16} className="text-cyan-200" />}
                  {uploading ? 'Uploading asset...' : 'Choose image from device'}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-100/70">
                  Image only
                </span>
              </label>
              <input id={inputId} type="file" accept={accept} className="hidden" onChange={handleFileChange} />
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-400/18 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
