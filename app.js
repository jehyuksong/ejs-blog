const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const { functionsIn, inRange } = require("lodash");
const app = express();

const homeStartingContent = "안녕하세요! 반갑습니다! 글을 작성해주세요!👇🏻";
const aboutContent = "EJS, MongoDB, Mongoose, Heroku";
const contactContent = "행복하세요!!!!!!";

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts,
      });
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedId = req.params.postId;
  Post.findOne({ _id: requestedId }, function (err, found) {
    if (!err) {
      res.render("post", { title: found.title, content: found.content });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", { startingContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { startingContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/delete", function (req, res) {
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const deleteId = req.body.deleteBtn;

  Post.findByIdAndRemove(deleteId, function (err, found) {
    if (!err) {
      console.log("Successfully Removed Post!!");
      res.redirect("/");
    }
  });
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000...");
});
