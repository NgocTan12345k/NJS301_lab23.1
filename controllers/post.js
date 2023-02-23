const Post = require("../models/post");
const fileHelper = require("../util/file");

exports.addPost = async (req, res, next) => {
  const { title, content } = req.body;
  const image = req.file;

  try {
    const x = image.path.split("/").slice(1);
    const y = x.unshift("http://localhost:4002");
    const z = x.join("/");

    const newPost = new Post({
      title: title,
      image: z,
      content: content,
    });

    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    console.log(error);
  }
};

exports.getPosts = async (req, res, next) => {
  const postList = await Post.find();
  try {
    res.status(200).json(postList);
  } catch (error) {
    console.log(error);
  }
};

exports.getPostDetail = async (req, res, next) => {
  const id = req.params.id;
  try {
    const postDetail = await Post.findById(id);
    res.status(200).json(postDetail);
  } catch (error) {
    console.log(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const id = req.params.id;
  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    console.log("deletePost-->", deletedPost);
    const x = deletedPost.image.split("/").slice(3, 5);
    const y = x.unshift("public");
    const z = x.join("/");
    console.log("z-->", z);
    fileHelper.deleteFile(z);
    res.status(200).json({ message: "Delete post success!" });
  } catch (error) {
    console.log(error);
  }
};

exports.editPost = async (req, res, next) => {
  const id = req.params.id;
  try {
    await Post.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json({ message: "Edit post successfully!" });
  } catch (error) {
    console.log(error);
  }
};
