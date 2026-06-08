const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

app.use(express.json());

// Replace this with your actual Netlify URL
app.use(cors({
  origin: 'https://esn-unipi-12345.netlify.app', // Make sure this matches exactly
  methods: ['GET', 'POST'],
  credentials: true
}));

const API_URL = "https://esn-unipi-backend.onrender.com";
const port = process.env.PORT || 4000;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "your_cloud_name",
  api_key: process.env.CLOUDINARY_API_KEY || "your_api_key",
  api_secret: process.env.CLOUDINARY_API_SECRET || "your_api_secret",
});

// Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "esn-unipi",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

// Image storage engine
/*const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });*/
// Get MongoDB URI from environment variable or use local
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://monkass:ESNUnipi@esnunipi.mhxfudu.mongodb.net/ESNUnipi";
// Add error handling:
// Database connection with mongodb
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
// API creation
app.get("/", (req, res) => {
  res.send("Express App running");
});

// Creating upload endpoint for single image
app.use("/images", express.static("upload/images"));

/*app.post("/upload", upload.single("newthing"), (req, res) => {
  res.json({
    success: 1,
    image_url: `${API_URL}/images/${req.file.filename}`,
  });
});

// Upload multiple images endpoint
app.post(
  "/upload-multiple",
  upload.array("additionalImages", 10),
  (req, res) => {
    try {
      const imageUrls = req.files.map(
        (file) => `${API_URL}/images/${file.filename}`
      );

      res.json({
        success: 1,
        image_urls: imageUrls,
      });
    } catch (error) {
      res.status(500).json({
        success: 0,
        message: "Multiple image upload failed",
      });
    }
  }
);*/
// Updated upload endpoint for single image
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Enhanced upload endpoint with better error handling
app.post("/upload", upload.single("newthing"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: 0,
        message: "No file uploaded",
      });
    }

    console.log("File uploaded to Cloudinary:", req.file);

    // Cloudinary returns the URL in req.file.path
    const imageUrl = req.file.path;

    res.json({
      success: 1,
      image_url: imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: 0,
      message: "Upload failed: " + error.message,
    });
  }
});

// Enhanced multiple upload endpoint
app.post(
  "/upload-multiple",
  upload.array("additionalImages", 10),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: 0,
          message: "No files uploaded",
        });
      }

      console.log(`${req.files.length} files uploaded to Cloudinary`);

      const imageUrls = req.files.map((file) => file.path);

      res.json({
        success: 1,
        image_urls: imageUrls,
      });
    } catch (error) {
      console.error("Multiple upload error:", error);
      res.status(500).json({
        success: 0,
        message: "Multiple image upload failed: " + error.message,
      });
    }
  }
);
// Schema for creating membersubmission
const JoinUs = mongoose.model("JoinUs", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  uni: {
    type: String,
    required: true,
  },
  howFound: {
    type: String,
    required: true,
  },
  whyWantJoin: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

app.post("/addjoinus", async (req, res) => {
  try {
    let joinus = await JoinUs.find({});
    let id;
    if (joinus.length > 0) {
      let last_joinus_array = joinus.slice(-1);
      let last_joinus = last_joinus_array[0];
      id = last_joinus.id + 1;
    } else {
      id = 1;
    }

    const joinusThing = new JoinUs({
      id: id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      uni: req.body.uni,
      howFound: req.body.howFound,
      whyWantJoin: req.body.whyWantJoin,
    });

    console.log(joinusThing);
    await joinusThing.save();
    console.log("Saved Join US Form");

    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error("Error adding join us form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add join us form",
    });
  }
});
// Creating API endpoint for getting all joinus
app.get("/alljoinus", async (req, res) => {
  try {
    let joinus = await JoinUs.find({}).sort({ date: -1 }); // Sort by newest first
    console.log("All join us forms fetched");
    res.send(joinus);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch join us forms",
    });
  }
});
// Schema for creating email
const Email = mongoose.model("Email", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

app.post("/addemail", async (req, res) => {
  try {
    let email = await Email.find({});
    let id;
    if (email.length > 0) {
      let last_email_array = email.slice(-1);
      let last_email = last_email_array[0];
      id = last_email.id + 1;
    } else {
      id = 1;
    }

    const emailThing = new Email({
      id: id,
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    });

    console.log(emailThing);
    await emailThing.save();
    console.log("Saved Email");

    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error("Error adding email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add email",
    });
  }
});
// Creating API endpoint for getting all emails
app.get("/allemails", async (req, res) => {
  try {
    let emails = await Email.find({}).sort({ date: -1 }); // Sort by newest first
    console.log("All emails fetched");
    res.send(emails);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch emails",
    });
  }
});
// Schema for creating news with additional images
const NewThing = mongoose.model("NewThing", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  additionalImages: [
    {
      type: String,
    },
  ],
  paragraph: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

app.post("/addnew", async (req, res) => {
  try {
    let news = await NewThing.find({});
    let id;
    if (news.length > 0) {
      let last_new_array = news.slice(-1);
      let last_new = last_new_array[0];
      id = last_new.id + 1;
    } else {
      id = 1;
    }

    const newThing = new NewThing({
      id: id,
      name: req.body.name,
      image: req.body.image,
      additionalImages: req.body.additionalImages || [],
      paragraph: req.body.paragraph,
    });

    console.log(newThing);
    await newThing.save();
    console.log("Saved");

    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error("Error adding news:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add news",
    });
  }
});

// Creating API endpoint for deleting news
app.post("/removenew", async (req, res) => {
  try {
    await NewThing.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete news",
    });
  }
});
app.post("/updatenew", async (req, res) => {
  try {
    const { id, name, image, additionalImages, paragraph } = req.body;

    const updatedNews = await NewThing.findOneAndUpdate(
      { id: parseInt(id) },
      {
        name: name,
        image: image,
        additionalImages: additionalImages || [],
        paragraph: paragraph,
        date: new Date(), // Update the date to current time
      },
      { new: true } // Return the updated document
    );

    if (!updatedNews) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    console.log("News updated:", updatedNews);
    res.json({
      success: true,
      news: updatedNews,
    });
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update news",
    });
  }
});
// Creating API endpoint for getting all news
app.get("/allnews", async (req, res) => {
  try {
    let news = await NewThing.find({}).sort({ date: -1 }); // Sort by newest first
    console.log("All news fetched");
    res.send(news);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
});

// Get single news by ID
app.get("/news/:id", async (req, res) => {
  try {
    const news = await NewThing.findOne({ id: parseInt(req.params.id) });
    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
});
//Api for events
const EventThing = mongoose.model("EventThing", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  additionalImages: [
    {
      type: String,
    },
  ],
  paragraph: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

app.post("/addevent", async (req, res) => {
  try {
    let events = await EventThing.find({});
    let id;
    if (events.length > 0) {
      let last_event_array = events.slice(-1);
      let last_event = last_event_array[0];
      id = last_event.id + 1;
    } else {
      id = 1;
    }

    const eventThing = new EventThing({
      id: id,
      name: req.body.name,
      image: req.body.image,
      additionalImages: req.body.additionalImages || [],
      paragraph: req.body.paragraph,
    });

    console.log(eventThing);
    await eventThing.save();
    console.log("Saved");

    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error("Error adding events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add events",
    });
  }
});

// Creating API endpoint for deleting news
app.post("/removeevent", async (req, res) => {
  try {
    await EventThing.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete events",
    });
  }
});
// Update event endpoint
app.post("/updateevent", async (req, res) => {
  try {
    const { id, name, image, additionalImages, paragraph } = req.body;

    const updatedEvent = await EventThing.findOneAndUpdate(
      { id: parseInt(id) },
      {
        name: name,
        image: image,
        additionalImages: additionalImages || [],
        paragraph: paragraph,
        date: new Date(),
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    console.log("Event updated:", updatedEvent);
    res.json({
      success: true,
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update event",
    });
  }
});
// Creating API endpoint for getting all news
app.get("/allevents", async (req, res) => {
  try {
    let events = await EventThing.find({}).sort({ date: -1 }); // Sort by newest first
    console.log("All news fetched");
    res.send(events);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
});

// Get single news by ID
app.get("/events/:id", async (req, res) => {
  try {
    const events = await EventThing.findOne({ id: parseInt(req.params.id) });
    if (!events) {
      return res.status(404).json({
        success: false,
        message: "events not found",
      });
    }
    res.json(events);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
});
app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on port: " + port);
  } else {
    console.log("Error " + error);
  }
});
