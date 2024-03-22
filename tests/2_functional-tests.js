const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  suite('Routing tests', function () {

    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai
          .request(server)
          .post("/api/books")
          .send({ title: "Harry Potter" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Harry Potter');
            done();
          })
      });

      test('Test POST /api/books with no title given', function (done) {
        chai
          .request(server)
          .post("/api/books")
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          })
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'is array');
            assert.property(res.body[0], 'comments')
            assert.property(res.body[0], 'commentCount');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');
            done();
          })
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .get("/api/books/65fd7dfd5ea5cccbab1fdc8e")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists')
            done();
          })
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .get("/api/books/65fd8885b9749261e64ed228")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'comments');
            assert.property(res.body, 'commentCount');
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            done();
          })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        chai
          .request(server)
          .post("/api/books/65fd8885b9749261e64ed228")
          .send({ comment: "The best book ever" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'comments')
            assert.property(res.body, 'commentCount');
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai
          .request(server)
          .post("/api/books/65fd7dfd5ea5cccbab1fdc8c")
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field comment");
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai
          .request(server)
          .post("/api/books/65fd7dfd5ea5cccbab2fdc8c")
          .send({ comment: "My favourite book" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          })
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .delete('/api/books/65fd8077e85d336ee22c1315')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "complete delete successful");
            done()
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai
          .request(server)
          .delete('/api/books/65fd7dfd5ea5cccbab1fdc8c')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done()
          })
      });

    });

  });

});
