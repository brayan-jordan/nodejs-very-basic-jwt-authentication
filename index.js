const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
var jwt = require("jsonwebtoken");

require("dotenv-safe").config({ path: ".env" });

const app = express();

app.use(logger("dev"));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.get("/users", verifyJWT, (req, res, next) => {
  return res.json("success user");
});

app.post("/login", (req, res, next) => {
  if (req.body.user === "brayan" && req.body.pwd === "123") {
    const id = 1;
    var token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 300,
    });
    res.status(200).send({ auth: true, token: token });
  }

  res.status(500).send("Login inválido!");
});

function verifyJWT(req, res, next) {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
}

app.listen(3333);
