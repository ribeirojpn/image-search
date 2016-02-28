'use strict'
const http = require('http');
const app = require('express')();
const mongoose = require('mongoose');
const bingSearch = require('bing.search');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/image-search');
var bing = new bingSearch('LK/uXGaadWmfyv3KmFc+IMx0d11MxhiAnG7FbOVWKtQ')

var searchSchema = mongoose.Schema({
  term: {
    type: String,
    required: true
  },
  when: {
    type: Date,
    default: Date.now
  }
});

var Search = mongoose.model('search', searchSchema);

app.get('/search/:search',function (req,res) {
  var options = {};
  if(req.query.offset){
    options = {
      top:req.query.offset
    };
  }

  bing.images(req.params.search, options, function (erro, images) {
    if (erro){
      res.json(erro);
    } else {
      var newSearch = new Search({
        term: req.params.search,
      })
      newSearch.save(function (erro,result) {
        if(erro){
          return console.error(erro);
        }
        console.log(result, ' saved');
      })
      res.json(images);
    }
  });
}, function (erro) {
  console.log(erro);
});

app.get('/historic', function (req,res) {
  Search.find({}).select({__v:0,_id:0}).exec().then(function (result) {
    res.json(result);
  });
});

http.createServer(app).listen(3000, () => {
  console.log('Server online...');
});
