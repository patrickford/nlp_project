const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const sentiment = require('sentiment');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer;

const pos = require('pos');
const tagger = new pos.Tagger();

const {DATABASE_URL, PORT} = require('./config');
const {analysisData, User} = require('./models');
const {countNgrams, filterObject, sortArray} = require('./utilities');

const app = express();
const passport = require('passport');
const jsonParser = bodyParser.json();

var request = require('request');
var request = request.defaults({jar: true});

var expressSession = require('express-session');
app.use(expressSession({ secret: 'keyboard cat' }));

app.use(express.static('./public'));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

mongoose.Promise = global.Promise;

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var LocalStrategy = require('passport-local').Strategy;
const localStrategy = new LocalStrategy((username, password, callback) => {
  let user;
  User
    .findOne({username: username})
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false, {message: 'Incorrect username'});
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false, {message: 'Incorrect password'});
      }
      else {
        return callback(null, user)
      }
    });
});
passport.use(localStrategy);

app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/',
    session: true
  }),
  function(req, res) {
    var lastName = req.user.lastName;
    var firstName = req.user.firstName
    var fullName = firstName + ' ' + lastName
    res.send(req.user)
  });

app.get('/logout', function(req, res){
  req.session.destroy();
  req.logout();
});

app.get('/history', (req, res) => {
  if (req.user) {
    console.log("User is already authenticated")
    console.log(req.user.username)
  }
  analysisData
    .find({"username":req.user.username})
    .exec()
    .then(posts => {
      res.json(posts.map(post => post.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

app.post('/user', (req, res) => {
  if (!req.body) {
    return res.status(400).json({message: 'No request body'});
  }
  if (!('username' in req.body)) {
    return res.status(422).json({message: 'Missing field: username'});
  }
  let {username, password, firstName, lastName, email} = req.body;
  if (typeof username !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: username'});
  }
  username = username.trim();
  if (username === '') {
    return res.status(422).json({message: 'Incorrect field length: username'});
  }
  if (!(password)) {
    return res.status(422).json({message: 'Missing field: password'});
  }
  if (typeof password !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: password'});
  }
  password = password.trim();
  if (password === '') {
    return res.status(422).json({message: 'Incorrect field length: password'});
  }
  return User
    .find({username})
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        return res.status(422).json({message: 'username already taken'});
      }
      // if no existing user, hash password
      return User.hashPassword(password)
    })
    .then(hash => {
      return User
        .create({
          username: username,
          password: hash,
          firstName: firstName,
          lastName: lastName,
          email: email
        })
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({message: 'Internal server error: ${err}'})
    });
});

app.put('/user', (req, res) => {
  User
    .findOneAndUpdate({username:req.body.username}, {$set:
      {
        firstName : req.body.first,
        lastName : req.body.last,
        email: req.body.email
      }
    })
    .exec()
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

app.post('/record', (req, res) => {
  if (req.user) {
    console.log("User is already authenticated")
    console.log(req.user.username)
  }
  var id = req.body.id;
  analysisData.findById(id, function (err, record){

    res.status(200).send(record);
  })
});

app.post('/posts', jsonParser, (req, res) => {
  responseObject = {};
  if (!req.user) {
    res.status(400).json({message: "unauthenticated"});
  }
  else {
    var url = req.body.url;
    var description = req.body.description;
    responseObject['url'] = url;
    responseObject['description'] = description;
    temp = [];
    return request(url, function (error, response, body) {
      var matches = body.match(/<\w.*>.*<.p>/g);
      for (var i=0; i<matches.length; i++ ) {
        var cleaned = matches[i].replace(/<[^</]>/g, '');
        var cleaned2 = cleaned.replace(/<\w*[^<]*>/g, '');
        var cleaned3 = cleaned2.replace(/<!/g, '');
        temp.push(cleaned3)
      }
    var target = temp.join("<br><br>");
    responseObject['raw'] = target;

    var tokenizer = new natural.WordTokenizer();
    var tokens = tokenizer.tokenize(target);
    var tokensLower = tokens.map(function(item){
      return item.toLowerCase();
    })

    var taggedWords = tagger.tag(tokensLower);
    var taggedWordsFreq = countNgrams(taggedWords, 2)
    responseObject['tagged'] = taggedWordsFreq;

    var NGrams = natural.NGrams;
    var bigrams = NGrams.ngrams(tokensLower, 2);
    var bigramsFreq = countNgrams(bigrams, 2);
    var bigramsFiltered = filterObject(bigramsFreq, 2);
    responseObject['bigrams'] = bigramsFiltered;

    var trigrams = NGrams.ngrams(tokensLower, 3);
    var trigramsFreq = countNgrams(trigrams, 3);
    var trigramsFiltered = filterObject(trigramsFreq, 3);
    responseObject['trigrams'] = trigramsFiltered;

    var sentimentAnalysis = sentiment(target);
    responseObject['sentiment'] = sentimentAnalysis;
    analysisData
      .create({
        text: responseObject,
        username: req.user.username
      })
      .then(returnedPost => res.status(201).json(responseObject))
      .catch(err => {
          console.error(err);
          res.status(500).json({error: 'Something went wrong'});
      });
    });
  };
});

app.delete('/analysis/:id', (req, res) => {
  analysisData
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
