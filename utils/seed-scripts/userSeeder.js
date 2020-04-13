const mongoose = require("mongoose");

const User = require("../../models/users");

const USERS = [
  {
    name: "Matthew",
    email: "matt@gmail.com",
    password: "mattman",
  },
  {
    name: "Mark",
    email: "mark@gmail.com",
    password: "markman",
  },
  {
    name: "Luke",
    email: "luke@gmail.com",
    password: "lukeman",
  },
  {
    name: "John",
    email: "john@gmail.com",
    password: "johnman",
  },
];

function seedUsers() {
  let counter = 0;
  USERS.forEach((user, index) => {
    dbUser = new User(user);
    dbUser.save((error) => {
      if (error) {
        mongoose.disconnect("disconnected from db with Error");
        return process.exit(1);
      }
      counter++;
      console.log(`user number ${index + 1} saved`);
      if (counter === USERS.length) {
        mongoose.disconnect(() => console.log("disconnected from database"));
      }
    });
  });
}

mongoose
  .connect(
    "mongodb+srv://mmbonu:dmjjmd123@cluster0-7mzem.mongodb.net/test?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => {
    console.log("connected to db");
    seedUsers();
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
