const chai = require("chai");
const chaiHttp =  require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

const {app, runServer, closeServer} = require('../server');

describe("nlp_project", function() {
  before(function() {
    return runServer();
  });
  after(function(){
    return closeServer();
  });

  it("should send username on post", function(done) {
    var credentials = {
      username: 'yurik4',
      password: 'test'
    }
    chai.request(app)
      .post('/login')
      .send(credentials)
      .then(function(res) {
        res.should.be.a("object")
        res.should.have.status(200)
        res.should.be.json
        res.body.should.have.property("username")
        done()
      })
  });



});
