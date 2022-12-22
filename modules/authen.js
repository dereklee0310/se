// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated())
//     return next()
//   res.redirect('/account/login/?loginNeeded=true')
// }

module.exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next()
  res.redirect('/account/login?login=false')
};