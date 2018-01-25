var express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  sqlite3 = require('sqlite3'),
  multer = require('multer');

const itemRoutes = express.Router();



var storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req,file,cb){
    cb(null,file.originalname);
  }
});

var upload = multer({storage: storage}).array('imageRent', 12);
var db = new sqlite3.Database('./src/db/base.db', sqlite3.OPEN_READWRITE, function(err) {
  if(err){
    console.log(err.message);
  }
  console.log('Connected!!!');
});
// Запросы SQL
const citis = 'SELECT value FROM cities';
const flats = 'SELECT flat_id,post_text,city,rooms,mebel,state,phone,internet,street,building,title,price,date_post,post_places,photo_dist from flats';
const form_insert = 'INSERT INTO flats' +
  '(title,post_text,city,street,building,rooms,state,mebel,internet,phone,price,date_post,post_places,photo_dist)' +
  ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
const deleteRow = 'DELETE INTO flats WHERE rowid=?';

itemRoutes.route('/citys').get(function(req,res){
  db.all(citis, [] , function(err,items) {
    if(err){
      console.log(err);
    }else{
      res.json(items);
    }
  });
});

itemRoutes.route('/flats').get(function (req,res) {
  db.all(flats, [], function(err,items) {
    if(err){
      console.log(err.message);
    }else{
      res.json(items);
    }
  });
});

itemRoutes.route('/add').post(function (req, res) {
  var insertElement = req.params.title;
  db.run(form_insert, [
    req.body.title,
    req.body.post_text,
    req.body.cities,
    req.body.address,
    req.body.building,
    req.body.rooms,
    req.body.state,
    req.body.mebel,
    req.body.internet,
    req.body.phone,
    req.body.price,
    req.body.date_post,
    req.body.post_places,
    req.body.fileList
  ] , function (err) {
    console.log(req.body);
    if(err){
      console.log(err.message);
    }else{
      req.itemID = this.lastID;
      console.log(req.itemID);
    }
  });
});

itemRoutes.route('/delete/:flat_id').get(function (req,res) {
  var flat_id = req.params.flat_id;
  db.run('DELETE FROM flats WHERE rowid=?', flat_id, function (err) {
    if(err){
      console.log(err.message);
    }
    console.log("Delete ");
  })
});

itemRoutes.route('/edit/:flat_id').get(function (req,res){
  var flat_id = req.params.flat_id;
  console.log(flat_id);
  db.get('SELECT * FROM flats WHERE flat_id=(?)', flat_id, function (err, item) {
    if(err){
      console.log(err.message);
    }else{
      res.json(item);
      console.log(item);
    }
  })
});

itemRoutes.route('/photos/upload').post(function (req, res) {
  upload(req,res, function(err){
    console.log(req.files);
    if(err){

    }
  })
});



const app = express();
app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(cors());
app.use('/database', itemRoutes);
app.get('/', function(req,res,next){
  res.sendFile(path.join(__dirname, '/', 'index.html'))
});


const port = process.env.PORT || 4000;

const server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});
