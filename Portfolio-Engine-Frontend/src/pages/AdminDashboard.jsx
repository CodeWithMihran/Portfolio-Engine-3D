import { useEffect, useState } from "react";
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

  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [collections, setCollections] = useState({
    projects: [],
    skills: [],
    experiences: [],
    education: [],
    certificates: [],
    achievements: [],
    contacts: [],
  });
  const [forms, setForms] = useState(initialForms);
  const [editingIds, setEditingIds] = useState({});
  const [messages, setMessages] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({});
  const [uploadLoading, setUploadLoading] = useState({});
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileUploadLoading, setProfileUploadLoading] = useState(false);
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: null,
  });

  const setCollectionItems = (key, items) => {
    setCollections((prev) => ({ ...prev, [key]: items }));
  };

  const sanitizeForUpdate = (item) => {
    const { _id, __v, createdAt, updatedAt, ...rest } = item;
    return rest;
  };

  const loadCollection = async (key, endpoint) => {
    const response = await API.get(endpoint);
    setCollectionItems(key, response.data || []);
  };

  const loadProfile = async () => {
    try {
      const response = await API.get("/profile");
      const data = response.data;

      setProfileForm((prev) => ({
        ...prev,
        ...data,
        socialLinks: {
          ...prev.socialLinks,
          ...(data.socialLinks || {}),
        },
        sectionVisibility: {
          ...prev.sectionVisibility,
          ...(data.sectionVisibility || {}),
        },
      }));
    } catch (error) {
      if (error.response?.status !== 404) {
        setProfileError("Failed to load profile data");
      }
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await Promise.all([
          loadProfile(),
          ...managerConfigs.map((config) =>
            loadCollection(config.key, config.endpoint)
          ),
          loadCollection("contacts", "/contact"),
        ]);
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          global: "Failed to load admin data",
        }));
      }
    };

    initialize();
  }, []);

  const handleFormChange = (key, field, value) => {
    setForms((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleEdit = (config, item) => {
    setForms((prev) => ({
      ...prev,
      [config.key]: {
        ...initialForms[config.key],
        ...item,
      },
    }));
    setEditingIds((prev) => ({
      ...prev,
      [config.key]: item._id,
    }));
    setMessages((prev) => ({ ...prev, [config.key]: "" }));
    setErrors((prev) => ({ ...prev, [config.key]: "" }));
  };

  const handleCancelEdit = (key) => {
    setForms((prev) => ({
      ...prev,
      [key]: initialForms[key],
    }));
    setEditingIds((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await API.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.imageUrl;
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setProfileUploadLoading(true);
    setProfileError("");

    try {
      const imageUrl = await uploadImage(file);
      setProfileForm((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));
    } catch (error) {
      setProfileError(
        error.response?.data?.message || "Failed to upload profile image"
      );
    } finally {
      setProfileUploadLoading(false);
      event.target.value = "";
    }
  };

  const handleSocialChange = (key, value) => {
    setProfileForm((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [key]: value,
      },
    }));
  };

  const handleVisibilityToggle = (key) => {
    setProfileForm((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [key]: !prev.sectionVisibility[key],
      },
    }));
  };

  const handleCreate = async (config, event) => {
    event.preventDefault();
    setLoading((prev) => ({ ...prev, [config.key]: true }));
    setMessages((prev) => ({ ...prev, [config.key]: "" }));
    setErrors((prev) => ({ ...prev, [config.key]: "" }));

    try {
      const editingId = editingIds[config.key];
      const response = editingId
        ? await API.put(`${config.endpoint}/${editingId}`, forms[config.key])
        : await API.post(config.endpoint, forms[config.key]);
      setMessages((prev) => ({
        ...prev,
        [config.key]:
          response.data.message ||
          `${editingId ? "Updated" : "Saved"} ${config.title}`,
      }));
      setForms((prev) => ({
        ...prev,
        [config.key]: initialForms[config.key],
      }));
      setEditingIds((prev) => ({
        ...prev,
        [config.key]: null,
      }));
      await loadCollection(config.key, config.endpoint);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [config.key]:
          error.response?.data?.message || `Failed to save ${config.title}`,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [config.key]: false }));
    }
  };

  const handleFieldImageUpload = async (configKey, field, event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadLoading((prev) => ({ ...prev, [configKey]: true }));
    setErrors((prev) => ({ ...prev, [configKey]: "" }));

    try {
      const imageUrl = await uploadImage(file);
      handleFormChange(configKey, field, imageUrl);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [configKey]:
          error.response?.data?.message || "Failed to upload image",
      }));
    } finally {
      setUploadLoading((prev) => ({ ...prev, [configKey]: false }));
      event.target.value = "";
    }
  };

  const handleDelete = async (config, id) => {
    try {
      await API.delete(`${config.endpoint}/${id}`);
      await loadCollection(config.key, config.endpoint);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [config.key]:
          error.response?.data?.message || `Failed to delete ${config.title}`,
      }));
    }
  };

  const requestDelete = (config, id) => {
    setConfirmState({
      open: true,
      title: `Delete ${config.title.slice(0, -1) || config.title}?`,
      description:
        "This action cannot be undone. The item will be removed from your portfolio.",
      onConfirm: async () => {
        await handleDelete(config, id);
        setConfirmState((prev) => ({ ...prev, open: false, onConfirm: null }));
      },
    });
  };

  const handleMove = async (config, item, direction) => {
    const items = [...collections[config.key]];
    const currentIndex = items.findIndex((entry) => entry._id === item._id);

    if (currentIndex === -1) {
      return;
    }

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    const currentItem = items[currentIndex];
    const targetItem = items[targetIndex];
    const currentOrder = currentItem.order ?? currentIndex;
    const targetOrder = targetItem.order ?? targetIndex;

    try {
      await Promise.all([
        API.put(`${config.endpoint}/${currentItem._id}`, {
          ...sanitizeForUpdate(currentItem),
          order: targetOrder,
        }),
        API.put(`${config.endpoint}/${targetItem._id}`, {
          ...sanitizeForUpdate(targetItem),
          order: currentOrder,
        }),
      ]);
      await loadCollection(config.key, config.endpoint);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [config.key]:
          error.response?.data?.message || `Failed to reorder ${config.title}`,
      }));
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileLoading(true);
    setProfileMessage("");
    setProfileError("");

    try {
      const response = await API.put("/profile", profileForm);
      setProfileMessage(response.data.message || "Profile saved successfully");
    } catch (error) {
      setProfileError(
        error.response?.data?.message || "Failed to save profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await API.patch(`/contact/${id}/read`);
      await loadCollection("contacts", "/contact");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        contacts: error.response?.data?.message || "Failed to update message",
      }));
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await API.delete(`/contact/${id}`);
      await loadCollection("contacts", "/contact");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        contacts: error.response?.data?.message || "Failed to delete message",
      }));
    }
  };

  const requestDeleteContact = (id) => {
    setConfirmState({
      open: true,
      title: "Delete message?",
      description:
        "This will permanently remove the message from your contact inbox.",
      onConfirm: async () => {
        await handleDeleteContact(id);
        setConfirmState((prev) => ({ ...prev, open: false, onConfirm: null }));
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-white/60">
              Logged in as {admin?.name || "Admin"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
          >
            Logout
          </button>
        </div>

        {errors.global ? (
          <div className="mb-6 rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-300">
            {errors.global}
          </div>
        ) : null}

        <div className="grid gap-8">
          <ProfileSettings
            profileForm={profileForm}
            profileMessage={profileMessage}
            profileError={profileError}
            profileLoading={profileLoading}
            profileUploadLoading={profileUploadLoading}
            sectionFields={sectionFields}
            socialFields={socialFields}
            onProfileChange={handleProfileChange}
            onProfileImageUpload={handleProfileImageUpload}
            onSocialChange={handleSocialChange}
            onVisibilityToggle={handleVisibilityToggle}
            onSubmit={handleProfileSubmit}
          />

          <div className="grid gap-8 xl:grid-cols-2">
            {managerConfigs.map((config) => (
              <CollectionManager
                key={config.key}
                title={config.title}
                fields={config.fields}
                form={forms[config.key]}
                editingId={editingIds[config.key]}
                items={collections[config.key]}
                loading={loading[config.key]}
                uploadLoading={uploadLoading[config.key]}
                message={messages[config.key]}
                error={errors[config.key]}
                onFieldChange={(field, value) =>
                  handleFormChange(config.key, field, value)
                }
                onUploadImage={(field, event) =>
                  handleFieldImageUpload(config.key, field, event)
                }
                onSubmit={(event) => handleCreate(config, event)}
                onEdit={(item) => handleEdit(config, item)}
                onMove={(item, direction) =>
                  handleMove(config, item, direction)
                }
                onCancelEdit={() => handleCancelEdit(config.key)}
                onDelete={(id) => requestDelete(config, id)}
                renderItem={(item) => {
                  const summary = config.renderItem(item);
                  return (
                    <>
                      <h3 className="text-lg font-semibold">{summary.title}</h3>
                      {summary.subtitle ? (
                        <p className="mt-1 text-sm text-cyan-200">
                          {summary.subtitle}
                        </p>
                      ) : null}
                      {summary.description ? (
                        <p className="mt-2 text-sm text-white/65">
                          {summary.description}
                        </p>
                      ) : null}
                    </>
                  );
                }}
                submitLabel={config.submitLabel}
              />
            ))}
          </div>

          <ContactInbox
            contacts={collections.contacts}
            onMarkRead={handleMarkRead}
            onDelete={requestDeleteContact}
            error={errors.contacts}
          />
        </div>
      </div>

      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        description={confirmState.description}
        onConfirm={() => confirmState.onConfirm?.()}
        onCancel={() =>
          setConfirmState({
            open: false,
            title: "",
            description: "",
            onConfirm: null,
          })
        }
      />
    </div>
  );
};

export default AdminDashboard;
