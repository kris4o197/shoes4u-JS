function attachUser(req, res, next) {
  res.locals.user = req.session.user || null;
  next();
}

function requireUser(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "ADMIN") {
    return res.status(403).send("Forbidden");
  }
  next();
}

module.exports = { attachUser, requireUser, requireAdmin };
