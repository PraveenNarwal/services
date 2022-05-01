import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./routes/user.js";

const port = 5000;
const app = express();

//mongodb+srv://services:<password>@cluster0.crwml.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/users", userRouter);
app.get("/", (req, res) => {
  res.send("Welcome to tour API");
});
const MONGODB_URL =
  "mongodb+srv://services:1234abcd@cluster0.crwml.mongodb.net/tour_db?retryWrites=true&w=majority";

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`server is runnign  on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(`${error} did not connect`);
  });
