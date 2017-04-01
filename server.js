const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const sentiment = require('sentiment');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer;
const pos = require('pos');
const tagger = new pos.Tagger();
const {DATABASE_URL, PORT} = require('./config');
const {userData, User} = require('./models');
const app = express();
const passport = require('passport');
const jsonParser = bodyParser.json();
var request = require('request');
var request = request.defaults({jar: true});
var expressSession = require('express-session');
app.use(express.static('./public'));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
mongoose.Promise = global.Promise;
app.use(expressSession({ secret: 'keyboard cat' }));
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
  passport.authenticate('local', {session: true}),
  function(req, res) {
    console.log(req.user)
    res.redirect('/nlp.html');
  });


function countNgrams(arr, n) {
  var reduced = {};
  for (var i=0; i<arr.length; i++) {
    var key = arr[i].join('-');
    if (reduced[key]) {
      reduced[key][n]++;
    }
    else {
      arr[i][n] = 1;
      reduced[key] = arr[i];
    }
  }
  return reduced;
}

function filterObject(obj, n) {
  freqList = []
  for (var prop in obj) {
    var freqCount = obj[prop][n]
    if (freqCount > 2) {
      freqList.push(obj[prop]);
    }
  }
  return freqList
}

function sortArray(arr) {
  arr.sort(function(a, b) {
    return a - b;
  })
}


app.get('/posts', (req, res) => {
  userData
    .find({"username":"yuri2"})
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
  let {username, password, firstName, lastName} = req.body;
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
          lastName: lastName
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

app.post('/posts', jsonParser, (req, res) => {
  if (req.user) {
    console.log("User is already authenticated")
  }
  const requiredFields = ['text'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      //console.error(message);
      return res.status(400).send(message);
    }
  }
  var url = req.body['text'];
  temp = [];
  responseObject = {};
  return request(url, function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    var matches = body.match(/<\w.*>.*<.p>/g);
    for (var i=0; i<matches.length; i++ ) {
      var cleaned = matches[i].replace(/<[^</]>/g, '');
      var cleaned2 = cleaned.replace(/<\w*[^<]*>/g, '')
      temp.push(cleaned2)
    }
  var target = temp.join("\n\n ");
  responseObject['raw'] = target;
  var tokenizer = new natural.WordTokenizer();
  var tokens = tokenizer.tokenize(target);
  var taggedWords = tagger.tag(tokens);
  var taggedWordsFreq = countNgrams(taggedWords, 2)
  //var wordsFiltered = filterObject(taggedWordsFreq, 2)
  console.log(taggedWordsFreq);
  responseObject['tagged'] = taggedWordsFreq;
  var NGrams = natural.NGrams;
  var bigrams = NGrams.ngrams(tokens, 2);
  var bigramsFreq = countNgrams(bigrams, 2);
  var bigramsFiltered = filterObject(bigramsFreq, 2);
  responseObject['bigrams'] = bigramsFiltered;
  var trigrams = NGrams.ngrams(tokens, 3);
  var trigramsFreq = countNgrams(trigrams, 3);
  var trigramsFiltered = filterObject(trigramsFreq, 3);
  responseObject['trigrams'] = trigramsFiltered;
  var sentimentAnalysis = sentiment(target);
  responseObject['sentiment'] = sentimentAnalysis;
  userData
    .create({
      text: responseObject,
      username: 'yuriyerastov'
    })
    .then(returnedPost => res.status(201).json(responseObject))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });
  });
});

app.delete('/posts/:id', (req, res) => {
  userData
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

app.put('/posts/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
  const updated = {};
  const updateableFields = ['username', 'text'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
  userData
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .exec()
    .then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
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

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
