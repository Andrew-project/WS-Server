let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {poolSize: 3, dbName: process.env.DB, useNewUrlParser: true, useCreateIndex: true});
module.exporse = {mongoose};
