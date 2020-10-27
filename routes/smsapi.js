var unirest = require("unirest");
const sendMail = require("./mail");
function sendSMS(mobile) {
  var req = unirest("GET", "https://www.fast2sms.com/dev/bulk");

  req.query({
    "authorization": "MKknXqjFeoSmzLrwHyR3cZVEx9W7p5AludCUvYNB012s4DbQhIuLOEtJ8URz0qrI5T7w4mdXbsoGDjP2",
    "sender_id": "FSTSMS",
    "message": "Successfully register to find us",
    "language": "english",
    "route": "p",
    "numbers": mobile,
  });

  req.headers({
    "cache-control": "no-cache"
  });


  req.end(function (res) {
    if (res.error) throw new Error(res.error);

    console.log(res.body);
  });
}
module.exports = sendSMS