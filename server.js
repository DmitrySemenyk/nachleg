var express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  sqlite3 = require('sqlite3'),
  multer = require('multer');

const itemRoutes = express.Router();



var storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, './src/assets/');
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
const flats = 'SELECT flat_id,post_text,city,rooms,mebel,state,phone,internet,street,building,title,price,date_post,post_places,photo_dist from flats ORDER BY date_post';
const form_insert = 'INSERT INTO flats' +
  '(title,post_text,city,street,building,rooms,state,mebel,internet,phone,price,date_post,post_places,photo_dist)' +
  ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
const deleteRow = 'DELETE INTO flats WHERE rowid=?';
const postInsert = 'INSERT INTO posts(flat,time_post) VALUES (?,?)';
const akkounts = 'SELECT akk_id,site,man,login,pass,email,phone,profilepath FROM akkaunts';
const akksites = 'SELECT site_id,site_name,element_akkaunts FROM sites'
const akkaunts_insert = 'INSERT INTO akkaunts ' +
  '(site,man,login,pass,email,phone)' +
  'VALUES (?,?,?,?,?,?)';
const deleteUser = 'DELETE INTO akkaunts WHERE akk_id=?';
// const editRow = 'UPADTE flats SET title='

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
  if(req.body.mebel >= 1) {
    req.body.mebel = true;
  }else{
    req.body.mebel = false
  };
  if(req.body.internet >= 1){
    req.body.internet = true;
  }else{
    req.body.internet = false
  }

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
    if(err){
      console.log(err.message);
    }else{
      req.itemID = this.lastID;
    }
  });
});

itemRoutes.route('/add_akkaunts').post(function (req, res) {

  db.run(akkaunts_insert, [
    req.body.service,
    req.body.metka,
    req.body.login,
    req.body.password,
    req.body.email,
    req.body.phone
  ] , function (err) {
    if(err){
      console.log(err.message);
    }else{
      req.itemID = this.lastID;
    }
  });
});

itemRoutes.route('/delete/:flat_id').get(function (req,res) {
  var flat_id = req.params.flat_id;
  db.run('DELETE FROM flats WHERE rowid=?', flat_id, function (err) {
    if(err){
      console.log(err.message);
    }
    console.log("Delete " + flat_id);
  })
});

itemRoutes.route('/delete_user/:akk_id').get(function (req,res) {
  console.log(req.params.akk_id);
  var user_id = req.params.akk_id;
  db.run('DELETE FROM akkaunts WHERE rowid=?', user_id, function (err) {
    if(err){
      console.log(err.message);
    }
    console.log("Delete USER " + user_id);
  })});

itemRoutes.route('/edit/:flat_id').post(function (req,res){
  var flat_id = req.params.flat_id;
  console.log("Here!");
  console.log(flat_id);
  console.log(req.body);
  const sqlEdit = "UPDATE flats SET title='" +
    req.body.title + "', post_text='" +
    req.body.post_text + "', city='" +
    req.body.city + "', street='" +
    req.body.street + "', building='" +
    req.body.building + "', rooms='" +
    req.body.rooms + "', state='" +
    req.body.state + "', mebel='" +
    req.body.mebel + "', internet='" +
    req.body.internet + "', phone='" +
    req.body.phone + "', price='" +
    req.body.price + "', date_post='" +
    req.body.date_post + "', post_places='" +
    req.body.post_places + "', photo_dist='" +
    req.body.photo_dist + "' WHERE flat_id=?";
  console.log(sqlEdit);
  db.run(sqlEdit, flat_id, function (err, item) {
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
    res.send(req.files);
    if(err){

    }
  })
});

itemRoutes.route('/posts').post(function(req,res){
  db.run(postInsert, [
    req.body.flat,
    req.body.time_post
  ], function (err) {
    console.log(req.body);
    if (err) {
      console.log(err.message);
    } else {
      req.itemID = this.lastID;
      console.log(req.itemID);
    }
  })
  res.send(req.body);
});


itemRoutes.route('/akkounts').get(function (req,res) {
  db.all(akkounts, [], function(err,items) {
    if(err){
      console.log(err.message);
    }else{
      res.json(items);
    }
  });
});

itemRoutes.route('/akksites').get(function (req,res) {
  db.all(akksites, [], function(err,items) {
    if(err){
      console.log(err.message);
    }else{
      res.json(items);
    }
  });
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
