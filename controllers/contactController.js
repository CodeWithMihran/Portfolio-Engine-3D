import Contact from "../models/Contact.js";

// 📩 CREATE CONTACT (Public - User sends message)
export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      // status defaults to 'new' via the model
    });

    res.status(201).json({
      message: "Message sent successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 GET ALL CONTACT MESSAGES (Admin Only)
// Added filtering by status as an optional feature
export const getContacts = async (req, res) => {
  try {
    const { status } = req.query; // e.g., /api/contacts?status=new
    const filter = status ? { status } : {};

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 GET SINGLE CONTACT MESSAGE
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ UPDATE MESSAGE STATUS & NOTES (Admin Only)
// This replaces the old markAsRead to handle all statuses and notes
export const updateContact = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (status) {
      contact.status = status;
      // Automatically manage the isRead boolean based on status
      contact.isRead = status !== "new";
    }

    if (adminNotes !== undefined) {
      contact.adminNotes = adminNotes;
    }

    await contact.save();

    res.json({
      message: "Message updated successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ DELETE CONTACT MESSAGE
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};