function validateRoleMiddleware(currentRole) {
  return (req, res, next) => {
    const { role } = req.user;
    if (currentRole !== role) {
      return res.status(403).json({ message: "Forbidden Request" });
    }
    next();
  };
}

const teacherOnlyMiddleware = validateRoleMiddleware("teacher");

module.exports = {
  validateRoleMiddleware,
  teacherOnlyMiddleware,
};