const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const db = require('./models');
const expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

let request;


describe('GET /api/users', function() {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  it('should find all users', function(done) {
    // Add some users to the db to test with
    db.User.bulkCreate([
      { username: 'Sally', password: 'test' },
      { username: 'Lane', password: 'sample' },
      { username: 'Chan', password: 'newPass' },
      { username: 'Muhammad', password: 'password' }
    ]).then(function() {
      // Request the route that returns all examples
      request.get('/api/users').end(function(err, res) {
        let responseStatus = res.status;
        let responseBody = res.body;

        // Run assertions on the response

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        expect(responseBody)
          .to.be.an('array')
          .that.has.lengthOf(4);

        expect(responseBody[0])
          .to.be.an('object')
          .that.includes({ username: 'Sally', password: 'test' });

        expect(responseBody[1])
          .to.be.an('object')
          .that.includes({ username: 'Lane', password: 'sample' });

        expect(responseBody[2])
        .to.be.an('object')
        .that.includes({ username: 'Chan', password: 'newPass' });

        expect(responseBody[3])
        .to.be.an('object')
        .that.includes({ username: 'Muhammad', password: 'password' });

        // The `done` function is used to end any asynchronous tests
        done();
      });
    });
  });
});

describe('POST /api/user', function() {
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  it('should save an example', function(done) {
    var reqBody = {
      username: 'John-Smith',
      password: 'stealthy'
    };

    // POST the request body to the server
    request
      .post('/api/user')
      .send(reqBody)
      .end(function(err, res) {
        var responseStatus = res.status;
        var responseBody = res.body;

        // Run assertions on the response

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        expect(responseBody)
          .to.be.an('object')
          .that.includes(reqBody);

        // The `done` function is used to end any asynchronous tests
        done();
      });
  });
});
