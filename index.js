'use strict'
const http = require('http');
const app = require('express')();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/image-search');

http.createServer().listen(3000, () => {
  console.log('Server online...');
});
