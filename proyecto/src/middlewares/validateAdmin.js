const db = require("../database/models");

module.exports = async function validateAdmin(req, res, next) {
  if (!Number.isSafeInteger(req.session?.userId) || req.session.userId <= 0) {
    return res.sendStatus(401);
  }
  try {
    const user = await db.User.findByPk(req.session.userId);
    if (!user) return res.sendStatus(401);
    if (Number(user.roleId) !== 1) return res.sendStatus(403);
    res.locals.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};
