const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User');
const   { ObjectID } = require("mongodb");
const mongoose = require('mongoose');
const Site = require('../models/siteler');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard


router.get("/dashboard", ensureAuthenticated, (req, res)=>{
    User.findById(req.user._id).populate("siteler").then((rUser)=>{
        res.render("dashboard", { 
            user: req.user,
            siteler: rUser.siteler,
            title: "username" });
    }).catch((e)=>{
        res.send(e);
    });
});

router.get('/sil/:id', ensureAuthenticated, function (req, res) {
  const user = req.user
  if(user.admin === false){
    res.redirect("/")
  } else {  
    res.redirect('/htrhtrghbfgnbhgfhfdgfdsgfhdfsgfdgfdgfdsregsdfgrfrsd/' + req.params.id)
  }
});

router.get('/htrhtrghbfgnbhgfhfdgfdsgfhdfsgfdgfdgfdsregsdfgrfrsd/:id', ensureAuthenticated, function (req,res) {
      User.findOneAndDelete(req.params.id).then(user => {
      res.redirect('/panel')
    })  
})
router.get('/panel', ensureAuthenticated, function (req, res) {
  mongoose.connect("mongo linki", function (err,db) {
    var users=db.collection("users");

    users.find({}).toArray(function (err, result){
      
      res.render("panel", {
        users : result,
        site: req.site,
        user: req.user,

      

        
      });

    })


  });
});

router.post("/dashboard", (req, res)=>{
  const { site_link} = req.body;


    const newsite = new Site({
      sahibi: req.user._id,
      site_link

    });
  
      User.findById(req.user._id).then((rUser)=>{
        if(!rUser){
            return res.redirect("/");
        }

            Site.create(newsite).then((rSite) => {
             rUser.siteler.push(rSite._id);
             rUser.save();
              rSite.save()
              .then(Site => {
                req.flash(
                  'success_msg',
                  'Tebrikler! Başarılı şekilde sitenizi eklediniz'
                );
                res.redirect('/dashboard');
              })
              
            })


    });
});


module.exports = router;
