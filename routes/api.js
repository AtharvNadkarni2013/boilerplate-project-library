/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const Book = require("../models/Book");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      Book.find({}, (err, data) => {
        if (err) return res.json({ error: "something went wrong" });

        let response = data.map((book) => {
          const comments = book.comments
          delete book._doc.comments;
          return { ...book._doc, commentcount: comments.length };
        });
        return res.json(response);
      });
    })

    .post(function (req, res) {
      let title = req.body.title;
      if (!title) return res.status(200).send("missing required field title")
      //response will contain new book object including atleast _id and title
      const newBook = new Book({
        title
      })

      newBook.save((err, data) => {
        return res.status(201).json({_id: data._id, title: data.title})
      })
    })

    .delete(function (req, res) {
      Book.deleteMany({}, (err, data) => {
        if (!err) return res.send('complete delete successful')
      })
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findOne({_id: bookid}, (err, data) => {
        if (err) return res.json({ error: "something went wrong" });
        if (!data) return res.status(200).send('no book exists')

        return res.json(data);
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) return res.status(200).send('missing required field comment')

      Book.findById(bookid).exec((err,data) => {
        if (!data) return res.status(200).send("no book exists")
        const book = data;
        book.comments = [...book.comments, comment]
        book.save((err, data) => {
          return res.status(201).json(data)
        })
      })
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid, (err, data) => {
        if (!data) return res.status(200).send("no book exists")
        if (!err) return res.status(200).send("delete successful")
      })
    });
};
