import jwt from "jsonwebtoken";
const TOKEN_SECRET = "user1234";

export const getToken = (id) => {
  const payload = { auth: id };
  return jwt.sign(payload, TOKEN_SECRET);
};

export const authorization = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    } else {
      req.userId = decoded.auth;
    }
  });
  next();
};
