import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CollectionManager from "../components/admin/CollectionManager";
import ConfirmModal from "../components/admin/ConfirmModal";
import ContactInbox from "../components/admin/ContactInbox";
import ProfileSettings from "../components/admin/ProfileSettings";
import {
  initialForms,
  initialProfileForm,
  managerConfigs,
  sectionFields,
  socialFields,
} from "../data/adminConfigs";
import API from "../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const storedAdmin = localStorage.getItem("admin");
  const admin = storedAdmin ? JSON.parse(storedAdmin) : null;

  // --- 📝 CORE STATE ---
  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [collections, setCollections] = useState({
    projects: [], skills: [], experiences: [], education: [],
    certificates: [], achievements: [], contacts: [],
  });
  const [forms, setForms] = useState(initialForms);
  const [editingIds, setEditingIds] = useState({});
  const [messages, setMessages] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({});
  const [uploadLoading, setUploadLoading] = useState({});
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileUploadLoading, setProfileUploadLoading] = useState(false);

  const [confirmState, setConfirmState] = useState({
    open: false, title: "", description: "", onConfirm: null,
  });

  // --- ⚙️ NESTED DATA UTILITY ---
  // This replaces 200 lines of manual handlers. It allows updating "a.b.c" paths.
  const setDeepValue = (obj, path, value) => {
    const segments = path.split('.');
    const lastIndex = segments.length - 1;
    const res = { ...obj };
    let pointer = res;

    for (let i = 0; i < lastIndex; i++) {
      const key = segments[i];
      pointer[key] = Array.isArray(pointer[key]) ? [...pointer[key]] : { ...pointer[key] };
      pointer = pointer[key];
    }
    pointer[segments[lastIndex]] = value;
    return res;
  };

  // --- 📡 DATA FETCHING ---
  const loadCollection = useCallback(async (key, endpoint) => {
    try {
      const response = await API.get(endpoint);
      setCollections((prev) => ({ ...prev, [key]: response.data || [] }));
    } catch (err) {
      console.error(`Fetch error for ${key}:`, err);
    }
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await API.get("/profile");
      setProfileForm((prev) => ({
        ...prev,
        ...data,
        theme: { ...prev.theme, ...(data.theme || {}) },
        socialLinks: { ...prev.socialLinks, ...(data.socialLinks || {}) },
        sectionVisibility: { ...prev.sectionVisibility, ...(data.sectionVisibility || {}) },
      }));
    } catch (error) {
      if (error.response?.status !== 404) setProfileError("Profile sync failed.");
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading({ global: true });
      await Promise.all([
        loadProfile(),
        ...managerConfigs.map((c) => loadCollection(c.key, c.endpoint)),
        loadCollection("contacts", "/contact"),
      ]);
      setLoading({ global: false });
    };
    initialize();
  }, [loadCollection]);

  // --- 🛠️ HANDLERS ---

  const handleFormChange = (configKey, fieldPath, value) => {
    setForms((prev) => ({
      ...prev,
      [configKey]: setDeepValue(prev[configKey], fieldPath, value)
    }));
  };

  const handleEdit = (config, item) => {
    setForms((prev) => ({ ...prev, [config.key]: { ...initialForms[config.key], ...item } }));
    setEditingIds((prev) => ({ ...prev, [config.key]: item._id }));
  };

  const handleCancelEdit = (key) => {
    setForms((prev) => ({ ...prev, [key]: initialForms[key] }));
    setEditingIds((prev) => ({ ...prev, [key]: null }));
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await API.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.imageUrl;
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfileUploadLoading(true);
    try {
      const url = await uploadImage(file);
      setProfileForm(prev => ({ ...prev, profileImage: url }));
    } catch (err) {
      setProfileError("Upload failed");
    } finally {
      setProfileUploadLoading(false);
    }
  };

  const handleCreate = async (config, event) => {
    event.preventDefault();
    const key = config.key;
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      const id = editingIds[key];
      id ? await API.put(`${config.endpoint}/${id}`, forms[key])
         : await API.post(config.endpoint, forms[key]);
      
      setMessages(prev => ({ ...prev, [key]: "Universe updated successfully!" }));
      handleCancelEdit(key);
      await loadCollection(key, config.endpoint);
    } catch (err) {
      setErrors(prev => ({ ...prev, [key]: "Operation failed." }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleMove = async (config, item, direction) => {
    const items = [...collections[config.key]];
    const idx = items.findIndex((i) => i._id === item._id);
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    try {
      const itemA = items[idx];
      const itemB = items[targetIdx];
      await Promise.all([
        API.put(`${config.endpoint}/${itemA._id}`, { ...itemA, order: itemB.order || targetIdx }),
        API.put(`${config.endpoint}/${itemB._id}`, { ...itemB, order: itemA.order || idx }),
      ]);
      await loadCollection(config.key, config.endpoint);
    } catch (err) {
      setErrors(prev => ({ ...prev, [config.key]: "Reorder failed." }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await API.put("/profile", profileForm);
      setProfileMessage("Identity & Theme synced.");
    } catch (err) {
      setProfileError("Save failed.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#020617] px-6 py-12 text-white font-sans">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tighter">PORTFOLIO ENGINE</h1>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-cyan-400">Admin Session: {admin?.name}</p>
          </div>
          <button onClick={handleLogout} className="rounded-full bg-white/5 px-8 py-2 text-xs font-bold uppercase tracking-widest text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
            Logout
          </button>
        </header>

        <div className="grid gap-12">
          {/* 🛠️ Profile & 3D Theme */}
          <ProfileSettings
            profileForm={profileForm}
            profileMessage={profileMessage}
            profileError={profileError}
            profileLoading={profileLoading}
            sectionFields={sectionFields}
            socialFields={socialFields}
            onProfileChange={(e) => setProfileForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            onSocialChange={(key, val) => setProfileForm(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: val } }))}
            onVisibilityToggle={(key) => setProfileForm(prev => ({ ...prev, sectionVisibility: { ...prev.sectionVisibility, [key]: !prev.sectionVisibility[key] } }))}
            onProfileImageUpload={handleProfileImageUpload}
            onSubmit={handleProfileSubmit}
          />

          {/* 📂 Managers (Projects, Skills, etc.) */}
          <div className="grid gap-8 xl:grid-cols-2">
            {managerConfigs.map((config) => (
              <CollectionManager
                key={config.key}
                {...config}
                form={forms[config.key]}
                items={collections[config.key]}
                loading={loading[config.key]}
                editingId={editingIds[config.key]}
                message={messages[config.key]}
                error={errors[config.key]}
                onFieldChange={(field, val) => handleFormChange(config.key, field, val)}
                onEdit={(item) => handleEdit(config, item)}
                onDelete={(id) => setConfirmState({
                  open: true, 
                  title: `Delete ${config.title}?`, 
                  description: "Permanent action.", 
                  onConfirm: async () => { await API.delete(`${config.endpoint}/${id}`); await loadCollection(config.key, config.endpoint); setConfirmState({open:false}); }
                })}
                onCancelEdit={() => handleCancelEdit(config.key)}
                onSubmit={(e) => handleCreate(config, e)}
                onMove={(item, dir) => handleMove(config, item, dir)}
              />
            ))}
          </div>

          {/* ✉️ Contact Inbox */}
          <ContactInbox
            contacts={collections.contacts}
            onUpdateStatus={async (id, updates) => { await API.patch(`/contact/${id}/status`, updates); loadCollection("contacts", "/contact"); }}
            onDelete={(id) => setConfirmState({
                open: true, 
                title: "Delete message?", 
                onConfirm: async () => { await API.delete(`/contact/${id}`); loadCollection("contacts", "/contact"); setConfirmState({open:false}); }
            })}
          />
        </div>
      </div>

      <ConfirmModal {...confirmState} onCancel={() => setConfirmState({ open: false })} />
    </div>
  );
};

export default AdminDashboard;