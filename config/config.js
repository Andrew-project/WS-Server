let env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    const config = require('./config.json');
    Object.assign(process.env, config[env]);
}
