#!/usr/bin/env node

'use strict';

var kue = require('kue');
var util = require('./lib/util');

var port = 3000;
var queue = kue.createQueue();

process.once('SIGINT', function() {
  if (queue.client.connected) {
    queue.shutdown(5000, function(err) {
      if (err) {
        util.error('Shutdown with error', err);
        process.exit(1);
      } else {
        util.log('Good bye!');
        process.exit(0);
      }
    });
  } else {
    util.log('Good bye!');
    process.exit(0);
  }
});

queue.on('error', function(err) {
  if (/ECONNREFUSED/.test(err.message)) {
    util.error(err.message);
    process.exit(1);
  } else {
    util.error(err.message);
  }
});

kue.app.listen(port);
util.log('Started monitor on port', port);
