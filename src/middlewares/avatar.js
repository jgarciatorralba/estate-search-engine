import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "./public/img/user/",
  filename: function (req, file, cb) {
    cb(null, req.user.id + "-" + Date.now() + path.extname(file.originalname));
  },
});

const limits = { fileSize: 1024 * 1024 * 5 };

const fileFilter = (req, file, cb) => {
  cb(null, file.mimetype === "image/jpeg" || file.mimetype === "image/png");
};

export default multer({ storage, limits, fileFilter });
