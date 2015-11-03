#!/usr/bin/env node

'use strict';

var kue = require('kue');
var uuid = require('uuid');
var util = require('./lib/util');

var queue = kue.createQueue();
var id = uuid.v4();

util.log('Queueing a new job:', id);

queue.create('demo-queue', {
  title:     'Test Job ' + id,
  firstName: 'Mike',
  lastName:  'Gauthier',
  email:     'mike@silverorange.com',
  template:  'welcome-email'
}).save(function(err) {
  if (err) {
    util.error('Error processing job:', err, id);
  } else {
    util.log('Job', id, 'queued successfully.');
    queue.shutdown(5000, function(err) {
      if (err) {
        util.error('Error disconnecting queue:', err);
      }
    });
  }
});
