import Contact from "../models/contact.js";

const detectDeviceType = (userAgent = "") => {
  const agent = String(userAgent).toLowerCase();
  return /mobile|android|iphone|ipad/.test(agent) ? "mobile" : "desktop";
};

// Public
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
    });

    res.status(201).json({
      message: "Message sent successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin
export const getContacts = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = status && status !== "all" ? { status } : {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContactStats = async (_req, res) => {
  try {
    const contacts = await Contact.find().select("status isRead createdAt userAgent");
    const last7DaysWindow = 7 * 24 * 60 * 60 * 1000;

    const stats = {
      total: contacts.length,
      unread: contacts.filter((item) => !item.isRead || item.status === "new").length,
      read: contacts.filter((item) => item.status === "read").length,
      replied: contacts.filter((item) => item.status === "replied").length,
      archived: contacts.filter((item) => item.status === "archived").length,
      mobile: contacts.filter((item) => detectDeviceType(item.userAgent) === "mobile").length,
      desktop: contacts.filter((item) => detectDeviceType(item.userAgent) === "desktop").length,
      last7Days: contacts.filter(
        (item) => Date.now() - new Date(item.createdAt).getTime() <= last7DaysWindow
      ).length,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportContactsCsv = async (_req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    const header = [
      "Name",
      "Email",
      "Subject",
      "Status",
      "Read",
      "Message",
      "Admin Notes",
      "Device",
      "Created At",
    ];

    const rows = contacts.map((item) =>
      [
        item.name,
        item.email,
        item.subject,
        item.status,
        item.isRead ? "Yes" : "No",
        item.message,
        item.adminNotes || "",
        detectDeviceType(item.userAgent),
        item.createdAt?.toISOString?.() || "",
      ]
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="portfolio-messages.csv"');
    res.send([header.join(","), ...rows].join("\n"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export const updateContact = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (status) {
      contact.status = status;
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
