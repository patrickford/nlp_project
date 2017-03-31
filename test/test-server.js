const chai = require("chai");
const chaiHttp =  require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

const {BlogPosts} = require('../models');
const {app} = require("../server.js");
BlogPosts.create("Great Title", "Content", "Yuri", "10Feb2010")

describe("BlogPosts", function() {
  it("should list item on get", function(done) {
    chai.request(app)
      .get('/blogs')
      .then(function(res) {
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a("array")
        res.body[0].should.be.a("object")
        res.body[0].should.have.property("title")
        res.body[0].title.should.equal("Great Title")
        done()
      })
  });

  it("should create item on post", function(done) {
    var testBlog = {
      title: "Title",
      content: "Content X",
      name: "George",
      date: "10Feb2010"
    }
    chai.request(app)
      .post('/blogs')
      .send(testBlog)
      .then(function(res) {
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a("array")
        res.body[0].should.be.a("object")
        res.body[0].should.have.property("title")
        res.body[0].title.should.equal("Great Title")
        done()
      })
  });


});
