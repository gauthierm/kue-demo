#!/usr/bin/env node

'use strict';

var kue = require('kue');
var util = require('./lib/util');

var queue = kue.createQueue();

/**
 * Cleanly shut down the queue on ctrl+c
 */
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

/**
 * Maximum number of jobs that will be dequeued from Redis in a single
 * operation. Jobs are not processed concurrently because node.js is single-
 * threaded.
 */
var concurrentJobs = 4;

queue.process('demo-queue', concurrentJobs, function(job, done) {
  util.log('=> starting job:', job.data.title);
  setTimeout(function() {
    util.log('=> completed job:', job.data.title);
    done();
  }, 5000);
});

util.log('Ready for work!');
