/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let prideAndPrejudice;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
            .keepOpen()
            .post('/api/books')
            .send({
              title: "Pride and Prejudice"
            })
            .end((err, res) => {
              prideAndPrejudice = res.body._id
              assert.equal(res.status, 201)
              assert.equal(typeof res.body._id, "string")
              assert.equal(res.body._id.length, 24)
              assert.equal(res.body.title, "Pride and Prejudice")
              done()
            })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
            .keepOpen()
            .post('/api/books')
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, "missing required field title")
              done()
            })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
            .keepOpen()
            .get('/api/books')
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.isArray(res.body)
              assert.property(res.body[0], "_id")
              assert.property(res.body[0], "title")
              assert.property(res.body[0], "commentcount")
              done()
            })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
            .keepOpen()
            .get('/api/books/abcdeabcdeabcdeabcdeabcd')
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, 'no book exists')
              done()
            })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
            .keepOpen()
            .get('/api/books/'+prideAndPrejudice)
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.property(res.body, '_id')
              assert.property(res.body, 'title')
              assert.property(res.body, 'comments')
              assert.isArray(res.body.comments)
              done()
            })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
            .keepOpen()
            .post('/api/books/'+prideAndPrejudice)
            .send({
              comment: "Such a good book!!! I love pride and prejudice"
            })
            .end((err, res) => {
              assert.equal(res.status, 201)
              assert.property(res.body, '_id')
              assert.property(res.body, 'title')
              assert.property(res.body, 'comments')
              assert.isArray(res.body.comments)
              done()
            })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
            .keepOpen()
            .post('/api/books/'+prideAndPrejudice)
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, "missing required field comment")
              done()
            })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
            .keepOpen()
            .post('/api/books/abcdeabcdeabcdeabcdeabcd')
            .send({
              comment: "What is this place?"
            })
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, "no book exists")
              done()
            })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
            .keepOpen()
            .delete('/api/books/'+prideAndPrejudice)
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, "delete successful")
              done()
            })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
            .keepOpen()
            .delete('/api/books/abcdeabcdeabcdeabcdeabcd')
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, "no book exists")
              done()
            })
      });

    });

  });

});
