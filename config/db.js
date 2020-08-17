const mongoose = require("mongoose");
const connectDB = () =>
  mongoose
    .connect(
      "mongodb+srv://admin-Zaid:1111@todolistdatabase-vy9pw.mongodb.net",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(
      () => {
        console.log("mongoDB conneted");
      },
      (err) => {
        console.log(err);
      }
    );
module.exports = connectDB;
