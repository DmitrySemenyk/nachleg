var express = require('express'),
  expressValidator = require('express-validator');
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  sqlite3 = require('sqlite3'),
  fs = require('fs');
  multer = require('multer');
  passport = require('passport');
  LocalStrategy = require('passport-local').Strategy;
  session = require('express-session');
  RedistStore = require('connect-redis')(session);


const itemRoutes = express.Router();

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

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
const citis = 'SELECT value FROM cities';  //SELECT DATE_FORMAT(date,'%d.%m.%Y') AS date_X, id, name, descr FROM tadat ORDER BY date DESC
const flats = 'SELECT flat_id,post_text,city,rooms,mebel,state,phone,internet,street,building,title,price,date_post,post_places,photo_dist from flats ORDER BY date_post DESC';
const form_insert = 'INSERT INTO flats' +
  '(title,post_text,city,street,building,rooms,state,mebel,internet,phone,price,date_post,post_places,photo_dist)' +
  ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
const deleteRow = 'DELETE INTO flats WHERE rowid=?';
const postInsert = 'INSERT INTO posts(flat,time_post) VALUES (?,?)';
const akkounts = 'SELECT akk_id,site,man,login,pass,email,phone,profilepath,status FROM akkaunts';
const akksites = 'SELECT site_id,site_name,element_akkaunts FROM sites';
const akkaunts_insert = 'INSERT INTO akkaunts ' +
  '(site,man,login,pass,email,phone,status)' +
  'VALUES (?,?,?,?,?,?,?)';
const deleteUser = 'DELETE INTO akkaunts WHERE akk_id=?';
const postplaces = 'INSERT INTO post_plase(post,akkaunt,state) VALUES (?,?,?)';
const postplaces_get = 'SELECT pp_id,post,akkaunt,state FROM post_plase';
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
      let arrAkaunts = req.body.post_places.split(',');
      let state = 'wait';
      for(key in arrAkaunts){
        db.run(postplaces, [req.itemID, arrAkaunts[key], state], function (err) {
          if(err){
            console.log(err.message);
          }
        })
      }
    }
  });
  res.json({success:true});
});

itemRoutes.route('/add_akkaunts').post(function (req, res) {
  console.log(req.body);
  db.run(akkaunts_insert, [
    req.body.service,
    req.body.metka,
    req.body.login,
    req.body.password,
    req.body.email,
    req.body.phone,
    req.body.status
  ] , function (err) {
    if(err){
      console.log(err.message);
    }else{
      req.itemID = this.lastID;
    }
  });
  res.json({success:true});
});

itemRoutes.route('/delete/:flat_id').get(function (req,res) {
  var flat_id = req.params.flat_id;
  db.run('DELETE FROM flats WHERE rowid=?', flat_id, function (err) {
    if(err){
      console.log(err.message);
    }
    console.log("Delete " + flat_id);
  })
  res.json({success:true});
});

itemRoutes.route('/delete_user/:akk_id').get(function (req,res) {
  console.log(req.params.akk_id);
  var user_id = req.params.akk_id;
  db.run('DELETE FROM akkaunts WHERE rowid=?', user_id, function (err) {
    if(err){
      console.log(err.message);
    }
    console.log("Delete USER " + user_id);
  })
  res.json({success:true});
});

itemRoutes.route('/edit/:flat_id').post(function (req,res){
  var flat_id = req.params.flat_id;
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
  db.run(sqlEdit, flat_id, function (err, item) {
    if(err){
      console.log(err.message);
    }else{
      res.json(item);
      console.log(item);
    }
  });
  res.json({success:true});
});

itemRoutes.route('/edituser/:user_id').post(function(req,res){
  var user_id = req.params.user_id;
  console.log(user_id);
  console.log(req.body);
  const sqlEdit = "UPDATE akkaunts SET site='" +
    req.body.site + "', man='" +
    req.body.man + "', login='" +
    req.body.login + "', pass='" +
    req.body.pass + "', email='" +
    req.body.email + "', phone='" +
    req.body.phone + "', profilepath='" +
    req.body.photo_dist + "' WHERE akk_id=?";
  console.log(sqlEdit);
  db.run(sqlEdit, user_id, function (err,item) {
    if(err){
      console.log(err)
    }else{
      res.json(item);
      console.log(item);
    }
  })
  res.json({success:true});
});

itemRoutes.route('/photos/upload').post(function (req, res) {
  upload(req,res, function(err){
    console.log(req.files);
    if(err){
      res.send(err.message);
    }
    res.send(req.files);
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

itemRoutes.route('/deleteimage/:name_image').get(function(req,res){
  var fileName = __dirname + '/src/assets/' + req.params.name_image;
  fs.unlinkSync(fileName);
  res.send(fileName);
});

itemRoutes.route('/post_places').get(function (req,res) {
  db.all(postplaces_get, [], function(err,items) {
    if(err){
      console.log(err.message);
    }else{
      res.json(items);
    }
  });
});

itemRoutes.route('/userLogin').post(function (req,res) {
  console.log(req.body);
  if(req.body.name == 'user' && req.body.password == 'user'){
    console.log('OK');
  }else{
    console.log('NO')
  }
  res.send("OK");
});


const app = express();
app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use('/database', itemRoutes);

//Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;
    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.get('/login', function (req,res) {
    console.log("Login GET");
    res.sendFile(path.join(__dirname, '/', 'index.html'))
});

app.post('/displaytable', function(req,res){
    console.log(req.body.password);
    console.log(req.body.name);
    console.log(req.body);
    console.log('Login POST');
    res.sendFile(path.join(__dirname, '/', 'index.html'))
  });

app.get('/', function(req,res){
  console.log("MAIN GET");
  res.sendFile(path.join(__dirname, '/', 'index.html'))
});



const port = process.env.PORT || 4000;

const server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});
