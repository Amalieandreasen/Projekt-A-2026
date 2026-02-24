const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

require("dotenv").config();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" },
  }),
);

const requireAuthWithTimeout = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not Authenticated" });
  }

  const maxTime = 20 * 1000;
  const now = Date.now();

  if (now - req.session.loginTime > maxTime) {
    req.session.destroy();
    return res.status(401).send("sessionen er udløbet, log ind igen");
  }

  next();
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/private", requireAuthWithTimeout, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "private.html"));
});

app.get("/api/userdata", requireAuthWithTimeout, (req, res) => {
  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Kan ikke læse brugerdata");
    }
    const users = JSON.parse(data);
    const user = users.find((u) => u.username === req.session.userId);
    if (!user) {
      return res.status(404).send("bruger ikke fundet");
    }
    res.json(user);
  });
});

app.post("/submit", (req, res) => {
  const { username, password } = req.body;

  fs.readFile("users.json", "utf8", async (err, data) => {
    if (err) {
      return res.status(500).send("kan ikke læse brugerdata");
    }

    const users = JSON.parse(data);
    const user = users.find((u) => u.username === username);

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.userId = user.username;
      req.session.loginTime = Date.now();
      res.redirect("/private");
    } else {
      res.status(401).send("Forkert brugernavn eller password");
    }
  });
});

app.listen(port, () => {
  console.log(`Serveren kører på http://localhost:${port}`);
});
