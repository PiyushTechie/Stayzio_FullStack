export function isGuest(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "guest") return next();
  req.flash("error", "Access restricted to guests only.");
  return res.redirect("/");
}

export function isHostOrAdmin(req, res, next) {
  if (req.isAuthenticated() && (req.user.role === "host" || req.user.role === "admin")) {
    return next();
  }
  req.flash("error", "Only hosts or admins can access this page.");
  return res.redirect("/");
}

