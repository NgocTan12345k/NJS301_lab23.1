const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post");
const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

// POST
router.post("/addPost", upload.single("image"), PostController.addPost);

// GET
router.get("/getPosts", PostController.getPosts);
router.get("/getPostDetail/:id", PostController.getPostDetail);

// DELETE
router.delete("/deletePost/:id", PostController.deletePost);

// UPDATE
router.put("/editPost/:id", PostController.editPost);

module.exports = router;
