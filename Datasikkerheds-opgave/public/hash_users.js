const bcrypt = require("bcrypt");
const fs = require("fs");

fs.readFile("users.json", "utf8", async (err, data) => {
  if (err) throw err;

  const users = JSON.parse(data);

  for (let user of users) {
    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);
  }

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  console.log("alle passwords er nu hashed");
});
