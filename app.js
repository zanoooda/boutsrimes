var express = require('express');
var path = require('path');
var http = require('http');
var mongoose = require('mongoose');

var app = express();

//TODO: Routing and errors pages.
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var server = http.createServer(app);

server.listen(8080, '127.0.0.1', function () {
  console.log('Server listening at localhost:8080');
});

//TODO: Understand what is this line means.
mongoose.Promise = global.Promise;
//TODO: Take this out to config.
mongoose.connect('mongodb://localhost:27017/boutsrimes');
var Schema = mongoose.Schema;

//TODO: Make author name unique.
//      This model is condidate to be a membership model.
var authorSchema = new Schema({
  name: String
});
//TODO: date in UNIXtime
var lineSchema = new Schema({
  body: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', default: null},
  date: { type: Date, default: Date.now }
});

//TODO: Remove lines collection and to add to the verse Schema array of the lines. 
var verseSchema = new Schema({
  title: String,
  lines: [],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', default: null },
  date: { type: Date, default: Date.now }
});

var Author = mongoose.model('Author', authorSchema);
var Verse = mongoose.model('Verse', verseSchema);
var Line = mongoose.model('Line', lineSchema);

var io = require('socket.io')(server);
io.on('connection', function (socket) {
  Verse.find({}, function(err, verses) {
    socket.emit('initialize', verses);
  });

  socket.on('create verse', function (data) {
    var verse = new Verse(data);
    verse.save();
  });
  socket.on('write line', function (data) {
    Verse.findOneAndUpdate(
      {_id: data.verse}, 
      { $push: { lines: new Line(data) } },
      { new: true },
      function(err, verse) {
        //TODO: Emit 'update verse' event
        socket.broadcast.emit('update verse', verse);
      }
    );
  });
  socket.on('join author', function (data) {
    // Method under construction
    var author = new Author(data);
    author.save();
  });
});

