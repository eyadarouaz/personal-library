'use strict';
const mongoose = require("mongoose");

module.exports = function (app) {

  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("successfully connected to database.");
    })
    .catch((error) => {
      console.log(error);
    })

  const bookModel = require('../models/book');

  app.route('/api/books')
    .get(function (req, res) {
      bookModel.find({}).exec()
        .then((data) => {
          if (data) res.json(data)
        })
        .catch((err) => console.log(err));
    })

    .post(function (req, res) {
      let title = req.body.title;

      if (!title) return res.send("missing required field title");

      const newBook = new bookModel({
        title: title
      })

      newBook.save()
        .then((data) => res.json({ title: data.title, _id: data._id }))
        .catch((err) => console.log(err))
    })

    .delete(function (req, res) {
      bookModel.deleteMany({})
        .then(() => res.send("complete delete successful"))
        .catch((err) => console.log(err))
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;

      bookModel.findById(bookid).exec()
        .then((data) => {
          if (data) return res.send(data)
          else return res.send("no book exists")
        })
        .catch((err) => console.log(err))
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!bookid) return res.send("missing required field _id");
      if (!comment) return res.send("missing required field comment");

      bookModel.findById(bookid).exec()
        .then((data) => {
          if (data) {
            data.comments.push(comment)
            data.commentCount++;
            bookModel.updateOne({ _id: data._id }, {
              $set: {
                comments: data.comments,
                commentCount: data.commentCount
              }
            })
              .exec()
              .then(() => res.send(data))
              .catch((err) => console.log(err))
          }
          else res.send("no book exists")
        })
        .catch((err) => console.log(err))
    })

    .delete(function (req, res) {
      let bookid = req.params.id;

      bookModel.findByIdAndDelete(bookid)
        .then((data) => {
          if (data) return res.send("complete delete successful")
          else return res.send("no book exists")
        })
        .catch((err) => console.log(err))
    });

};
