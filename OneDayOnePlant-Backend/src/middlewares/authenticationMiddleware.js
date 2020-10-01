const authenticationService = require("../services/authenticationService");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    next(error);
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = authenticationService.verifyJwtToken(
    token,
    process.env.JWT_SECRET
  );

  req.userId = decodedToken.userId;
  next();
};
