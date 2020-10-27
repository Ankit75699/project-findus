const express = require("express");
const url = require("url");
const router = express.Router();
const indexModel = require("../models/indexmodel");
var nodemailer = require('nodemailer');
const sendMail = require('./mail')
const sendSMS = require('./smsapi')
/* GET home page. */
router.use((req, res, next) => {
  if (req.session.sunm != undefined) req.session.destroy();
  next();
});
cunm = "";
cpass = "";
router.use("/login", (req, res, next) => {
  if (req.cookies.cunm != undefined) {
    cunm = req.cookies.cunm;
    cpass = req.cookies.cpass;
  }
  next();
});
router.get("/", function (req, res, next) {
  indexModel
    .fetchAll("category")
    .then((result) => {
      res.render("index", { clist: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/viewsubcategory", function (req, res, next) {
  var catnm = url.parse(req.url, true).query.catnm;
  indexModel
    .fetchsubcategory(catnm)
    .then((result) => {
      res.render("viewsubcategory", { catnm: catnm, sclist: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/about", function (req, res, next) {
  res.render("about");
});

router.get("/contact", function (req, res, next) {
  res.render("contact");
});

router.get("/service", function (req, res, next) {
  res.render("service");
});

router.get("/register", function (req, res, next) {
  res.render("register", { msg: "" });
});
router.post('/register', function (req, res, next) {
  indexModel.register(req.body).then((result) => {
    sendMail(req.body.email, req.body.password)
    sendSMS(req.body.mobile)
    res.render('register', result);
  }).catch((err) => {
    console.log(err)
  })
});


router.get('/verifyuser', function (req, res, next) {
  var emailid = url.parse(req.url, true).query.emailid
  indexModel.verifyuser(emailid).then((result) => {
    res.redirect('/login')
  }).catch((err) => {
    console.log(err)
  })
});
router.get("/login", function (req, res, next) {
  res.render("login", { msg: "", cunm: cunm, cpass: cpass });
});
router.post("/login", function (req, res, next) {
  indexModel
    .login(req.body)
    .then((result) => {
      if (result.length == 0)
        res.render("login", {
          msg: "Invalid user please login again or verify account....",
          cunm: cunm,
          cpass: cpass,
        });
      else {
        req.session.sunm = result[0].email;
        req.session.srole = result[0].role;
        if (req.body.chk != undefined) {
          res.cookie("cunm", result[0].email, {
            expires: new Date(Date.now() + 900000),
          });
          res.cookie("cpass", result[0].password, {
            expires: new Date(Date.now() + 900000),
          });
        }
        if (result[0].role == "admin") res.redirect("/admin");
        else res.redirect("/user");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/logout", function (req, res, next) {
  res.redirect("/login");
});
module.exports = router;
