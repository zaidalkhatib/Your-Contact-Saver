const express = require("express");
const connectDB = require("./config/db");
const app = express();
connectDB();
app.use(express.json({extended: false}));

app.use("/user", require("./routes/user"));
app.use("/auth", require("./routes/auth"));
app.use("/contacts", require("./routes/contacts"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`PORT ${PORT} listening and refeshing...`);
});
