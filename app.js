//app.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);


require("./connection/connect");
const auth = require("./routes/auth");
const list = require("./routes/list");


app.use(express.json());
app.use("/app", auth);
app.use("/api", list);
const Port = 5000;
app.listen(Port, () => {
  console.log(`server is running at ${Port}`);
});
