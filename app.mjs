import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.mjs";
import bp from "body-parser";
import cookieParser from "cookie-parser";
import User from "./models/User.mjs";
import { requireAuth, checkUser } from "./middleware/authMiddleware.mjs";

const port = 8888;

const app = express();

// middleware
app.use(express.static("public"));

// view engine
app.set("view engine", "ejs");

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use(cookieParser());

// database connection
const dbURI =
  "mongodb+srv://toychiboyevbobur16:1234@cluster0.vofdqc6.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.get("/acc", (req, res) => res.render("acc"));
app.get("/accept", (req, res) => res.render("accept"));
app.use(authRoutes);

app.get("/get", async (req, res) => {
  // Fetch all todos from MongoDB using Mongoose
  try {
    const users = await User.find();
    res.json(users);
    console.log(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
  }
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;

  console.log(cookies);

  res.json(cookies);
});

app.get("/set-cookies", (req, res) => {
  res.cookie("newUser", false);
  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  res.send("You got the cookies");
});

app.use(authRoutes);
