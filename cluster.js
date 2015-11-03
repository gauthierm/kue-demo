#!/usr/bin/env node

'use strict';

var kue = require('kue');
var cluster = require('cluster');
var util = require('./lib/util');

var queue = kue.createQueue();
var port = 3000;

var clusterWorkerSize = require('os').cpus().length;

if (cluster.isMaster) {
  kue.app.listen(port);
  util.log('Started monitoring server.');
  for (var i = 0; i < clusterWorkerSize; i++) {
    util.log('Ready for work on node', i);
    cluster.fork({ KUE_DEMO_NODE: i });
  }
} else {
  var nodeId = process.env.KUE_DEMO_NODE;

  queue.process('demo-queue', 2, function(job, done) {
    var pending = 5;
    var total = pending;
    var interval = null;

    var progress = function() {
      util.log('sending progress on ' + nodeId + ' for ' + job.data.title);
      job.progress(total - pending, total);
      pending--;
      if (pending === 0) {
        done();
        clearInterval(interval);
      }
    };

    progress();
    interval = setInterval(progress, 1000);
  });
}
