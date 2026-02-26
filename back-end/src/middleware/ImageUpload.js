import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // 🖼 images
  if (file.fieldname === "images") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  }

  // 🎥 video
  else if (file.fieldname === "video") {
    if (file.mimetype === "video/mp4") {
      cb(null, true);
    } else {
      cb(new Error("Only MP4 videos are allowed"), false);
    }
  }

  // ❓ unknown field
  else {
    cb(new Error("Unknown file field"), false);
  }
};

export default multer({ storage, fileFilter });
