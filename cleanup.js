#!/usr/bin/env node

'use strict';

var kue = require('kue');
var util = require('./lib/util');

kue.Job.range(0, 1000, 'asc', function(err, jobs) {
  jobs.forEach(function(job) {
    job.remove(function() {
      util.log('removed ', job.id);
    });
  });
});


kue.Job.rangeByState('complete', 0, 1000, 'asc', function(err, jobs) {
  jobs.forEach(function(job) {
    job.remove(function() {
      util.log('removed ', job.id);
    });
  });
});
