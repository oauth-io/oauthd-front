var ecstatic, fs, restify;

restify = require('restify');

ecstatic = require('ecstatic');

fs = require('fs');

module.exports = function(env) {
  var exp;
  exp = {};
  exp.setup = function(callback) {
    env.server.get(/^(\/.*)/, function(req, res, next) {
      if (req.params[0] === '/') {
        res.setHeader('Location', '/home');
        res.send(302);
      }
      return fs.stat(__dirname + '/public' + req.params[0], function(err, stat) {
        if (stat != null ? stat.isFile() : void 0) {
          next();
        } else {
          return fs.readFile(__dirname + '/public/index.html', {
            encoding: 'UTF-8'
          }, function(err, data) {
            res.setHeader('Content-Type', 'text/html');
            res.send(200, data);
          });
        }
      });
    }, restify.serveStatic({
      directory: __dirname + '/public',
      "default": __dirname + '/public/index.html'
    }));
    return callback();
  };
  return exp;
};
