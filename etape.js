const fs = require("fs");
const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID;
const app = express();
app.set('view engine', 'ejs'); // générateur de template 
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))  // pour utiliser le dossier public
app.use(bodyParser.json())  // pour traiter les données JSON

var db // variable qui contiendra le lien sur la BD

var content = fs.readFileSync("public/text/collection_provinces.json");

var lecturejson = require("C:/veille_finale/ef2/public/text/collection_provinces.json");


MongoClient.connect('mongodb://127.0.0.1:27017/test', (err, database) => {
  if (err) return console.log(err)
  db = database

  app.listen(8081, () => {
    console.log('ÇA FONCTIONNE!? Connexion à la BD et on écoute sur le port 8081')
  })
})

app.get('/question1', (req, res, next) => {

	res.send(lecturejson);

})

app.get('/question2', (req, res) => {

	var data = fs.readFileSync(__dirname + "/public/text/collection_provinces.json", "utf8")
	res.render('index.ejs', {examf2 : JSON.parse(data)});

})

app.get('/question3', (req, res) => {

	db.collection('examf2').find().toArray(function(err, resultat){
       if (err){  console.log(err)
        return

       }

       console.log("relsultat2 = " + resultat)

    // affiche le contenu de la BD
    res.render('index.ejs', {examf2: resultat})

    console.log("relsultat1 = " + resultat)
    //console.log("cursor = " + cursor)

    }) 

})


app.post('/examf2',  (req, res) => {
  db.collection('examf2').save(req.body, (err, result) => {
      if (err) return console.log(err)
      console.log('sauvegarder dans la BD')
      res.redirect('/')
    })
})


//---------------------------------------

app.get('/',  (req, res) => {
   console.log('la route route get / = ' + req.url)
 
    var cursor = db.collection('examf2').find().toArray(function(err, resultat){
       if (err) return console.log(err)
    // renders index.ejs
    // affiche le contenu de la BD
    res.render('index.ejs', {examf2: resultat})

    }) 
    
})

app.get('/formulaire',  (req, res) => {
   console.log('la route  get / = ' + req.url)
   res.sendFile(__dirname + "req.url")
})


app.get('/detruire/:id', (req, res) => {
 var id = req.params.id
 console.log(id)
 db.collection('examf2')
 .findOneAndDelete({"_id": ObjectID(req.params.id)}, (err, resultat) => {

if (err) return console.log(err)
 res.redirect('/')  // redirige vers la route qui affiche la collection
 })
})


app.post('/modifier/:id', (req, res) => {
 var id = req.params.id
 console.log(id)
 console.log(req)
 db.collection('examf2')
 .findOneAndUpdate({"_id": ObjectID(req.params.id)}, req.body ,(err, resultat) => {

if (err) return console.log(err)
 res.redirect('/')  // redirige vers la route qui affiche la collection
 })
})