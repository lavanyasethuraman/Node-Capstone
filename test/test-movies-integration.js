const chai = require('chai');
const chaiHttp = require('chai-http');
var User = {};
const should = chai.should();
chai.use(chaiHttp);
const { app, runServer, closeServer } = require('../server');
const mongoose = require('mongoose');
const { TEST_DATABASE_URL } = require('../config');

describe('Movie Users API', function () {

      before(function () {
        return runServer(TEST_DATABASE_URL);
      });
      after(function () {
        return closeServer();
      });

//Test Sign-up form
      describe('Users Sign-up', function () {
        function randomNumber() {
          return Math.floor(Math.random() * 100 + 1);
        }
        it('Should Create a Movie User', function () {
          User = {
            username: 'testUser' + randomNumber(),
            password: 'password'
          };
          return chai.request(app)
            .post('/users')
            .send(User)
            .then(function (res) {
              res.body.message.should.equal(User.username);
            });
        });
      });

//Test Logging in
      describe('Users Log-in', function () {
        it('Should Log-in the existing Movie User', function () {
          return chai.request(app)
            .post('/users/me')
            .send(User)
            .then(function (res) {
              res.body.granted.should.equal(true);
            });
        });
      });
//Test Movie Search
      describe('Movie Search', function () {
        it('should get details of a movie', function () {
          var searchTerm = "Forrest Gump";
          var query = encodeURI(searchTerm);
          return chai.request(app)
            .get('/movies?query=' + query)
            .then(function (res) {
              res.should.be.json;
              res.body[0].Title.should.equal(searchTerm);
            });
        });
      });

});

