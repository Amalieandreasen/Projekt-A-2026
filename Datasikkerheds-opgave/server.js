// imports
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

// session konfiguration
app.use(
  session({
    // signere session id med SESSION_SECRET fra .en filen
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // hhtponly: true = js i browseren kan ikke læse cookie
    // sameSite:"lax" = cookien sendes ikke med fra fremmede websites
    // maxAge: 20*1000 = session cookie udløber efter 20 sekunder
    cookie: { httpOnly: true, sameSite: "lax", maxAge: 20 * 1000 },
  }),
);

// authorization middleware (authorization)
const requireAuthWithTimeout = (req, res, next) => {
  // hvis ikke brugeren er logget ind, så 401
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not Authenticated" });
  }

  const maxTime = 20 * 1000;
  const now = Date.now();

  // session destroyes efter max time
  if (now - req.session.loginTime > maxTime) {
    // fjerner session fra server
    req.session.destroy();
    return res.status(401).send("sessionen er udløbet, log ind igen");
  }

  next();
};

// login side
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// private side, tjekker middleware før adgang gives
app.get("/private", requireAuthWithTimeout, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "private.html"));
});

// api route for følsomme oplysninger
// kun brugere der er autoriseret kan få adgang og se
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

// login route (authentication)
app.post("/submit", (req, res) => {
  // brugernavn og adgangskode modtages
  const { username, password } = req.body;

  // users.json læses
  fs.readFile("users.json", "utf8", async (err, data) => {
    if (err) {
      return res.status(500).send("kan ikke læse brugerdata");
    }

    const users = JSON.parse(data);
    const user = users.find((u) => u.username === username);

    // password sammenlignes.
    // brcypt hasher det indtastede password, sammenligner med gemt hash og returnere true/false
    if (user && (await bcrypt.compare(password, user.password))) {
      // identitet og login tidspunkt gemmes
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
