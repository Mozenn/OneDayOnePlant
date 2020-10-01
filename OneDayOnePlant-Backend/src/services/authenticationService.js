const { promisify } = require("util");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const ejs = require("ejs");

const User = require("../models/user");
const logger = require("../utils/logger");

const verifyJwtToken = (token, secret) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, secret);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      err.statusCode = 401;
      err.message = "Token expired";
      throw err;
    }
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authentificated");
    error.statusCode = 401;
    throw error;
  }

  return decodedToken;
};

const signupUser = (username, email, password) => {
  return bcrypt
    .hash(password, 12)
    .then((hashedPwd) => {
      const user = new User({ username, email, password: hashedPwd });
      return user.save();
    })
    .then((user) => {
      const token = jwt.sign(
        { email: user.email, userId: user._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "4h" }
      );

      sendVerificationMail(user._id, user.email, user.username);

      return { token, user };
    });
};

const loginUser = (username, password) => {
  let loadedUser;

  return User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        const error = new Error("User does not exist");
        error.statusCode = 401;
        error.message = "Incorrect user credentials";
        throw error;
      }

      if (!user.isVerified) {
        const error = new Error("User account not validated");
        error.statusCode = 401;
        throw error;
      }

      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Incorrect credentials");
        error.statusCode = 401;
        error.message = "Incorrect user credentials";
        throw error;
      }

      const token = jwt.sign(
        { email: loadedUser.email, userId: loadedUser._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "4h" }
      );

      return { token, loadedUser };
    });
};

const sendVerificationMail = (receiverId, receiverEmail, receiverUsername) => {
  const ejsRender = promisify(ejs.renderFile);

  const token = jwt.sign(
    { email: receiverEmail, userId: receiverId },
    process.env.EMAIL_SECRET,
    { expiresIn: "1w" }
  );

  return ejsRender(
    __dirname + path.sep + path.join("..", "views", "mail.ejs"),
    {
      username: receiverUsername,
      link: `${process.env.API_URL}/verify/${token}`,
    }
  ).then((str) => {
    // TODO
    // get token in redis and check if still valid

    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground" // Redirect URL
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });
    const accessToken = oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.SENDER_EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
        expires: 1484314697598,
      },
      // tls: {
      //   rejectUnauthorized: false,
      // },
    });

    const message = {
      from: "sender@server.com",
      to: receiverEmail,
      subject: "Account confirmation",
      text: "",
      html: str,
      attachments: [
        {
          filename: "logo.png",
          path:
            __dirname +
            path.sep +
            path.join("..", "..", "public", "image", "logo.png"),
          cid: "unique@cid", //same cid value as in the html img src
        },
      ],
    };

    return transporter
      .sendMail(message)
      .then(() => {
        logger.info("Verification Email sent");
        transporter.close();
        return;
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  });
};

const confirmUser = (token) => {
  const decodedToken = verifyJwtToken(token, process.env.EMAIL_SECRET);
  const userId = decodedToken.userId;

  return User.findById(userId).then((user) => {
    if (!user) {
      const error = new Error("User does not exist");
      error.statusCode = 401;
      error.message = "Incorrect user credentials";
      throw error;
    }

    user.isVerified = true;

    user.save();

    return user;
  });
};

module.exports = {
  verifyJwtToken,
  signupUser,
  loginUser,
  confirmUser,
};
