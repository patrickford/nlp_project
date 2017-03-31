exports.DATABASE_URL = process.env.MONGODB_URI ||
                      'mongodb://localhost/nlp';
exports.PORT = process.env.PORT || 8080;
