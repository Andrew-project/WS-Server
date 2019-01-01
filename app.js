require('./config/config');
const {mongoose} = require('./db/mongoose');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const version = 'v1';
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(`/api/${version}/**`, cors());
app.use(`/api/${version}/**`, require('./middleware/resExtend'));
app.use(`/api/${version}/**`, require('./middleware/reqExtend'));

app.use(`/api/${version}/wx`, require('./routes/wx/route'));
app.use(`/api/${version}/open`, require('./routes/open/route'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).send('route not found');
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    // res.status(err.status || 500);
    // res.render('error');
    if (typeof err === 'string') {
        err = new Error(err);
    }
    console.error(err)
    res.sendError(err.message, err.status || 500);
});

module.exports = app;
