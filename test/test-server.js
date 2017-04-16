const chai = require("chai");
const chaiHttp =  require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

const {app, runServer, closeServer} = require('../server');

var credentials = {
      username: 'yurik4',
      password: 'test'
    }

return chai.request(app)
  .post('/login')
  .send(credentials)
  .then(function(res) {
    console.log(res);
    res.should.be.a("object");
  })


// describe("nlp_project", function() {
//   it("should send username on post", function(done) {
//     var credentials = {
//       username: 'yurik4',
//       password: 'test'
//     }
//     // chai.request(app)
//     //   .post('/login')
//     //   .send(credentials)
//     //   .then(function(res) {
//     //     console.log(res)
//     //     res.should.be.a("object")
//     //     // res.should.have.status(200)
//     //     // res.should.be.json
//     //     // res.body.should.be.a("array")
//     //     // res.body[0].should.be.a("object")
//     //     // res.body[0].should.have.property("title")
//     //     // res.body[0].title.should.equal("Great Title")
//     //     done()
//     //   })
//   });
//
//   // it("should create item on post", function(done) {
//   //   var testBlog = {
//   //     title: "Title",
//   //     content: "Content X",
//   //     name: "George",
//   //     date: "10Feb2010"
//   //   }
//   //   chai.request(app)
//   //     .post('/blogs')
//   //     .send(testBlog)
//   //     .then(function(res) {
//   //       res.should.have.status(200)
//   //       res.should.be.json
//   //       res.body.should.be.a("array")
//   //       res.body[0].should.be.a("object")
//   //       res.body[0].should.have.property("title")
//   //       res.body[0].title.should.equal("Great Title")
//   //       done()
//   //     })
//   // });
//
//
// });
