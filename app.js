if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");

// Models
const listing = require("./models/listing");
const Review = require("./models/review");
const User = require("./models/user.js");

// Middleware
const wrapAsync = require("./utils/wrapAsync");
const { isLoggedIn, isOwner, isReviewAuthor } = require("./middleware.js");

// 🔹 MongoDB URL (Atlas in production, local in dev)
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wonderlust";



// Connect DB
async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ Connected to MongoDB");
}
main().catch(err => console.log("❌ Mongo Error:", err));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// 🔹 Session store in MongoDB
const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SESSION_SECRET || "thisshouldbeabettersecret",
  },
  touchAfter: 24 * 3600, // update session only once a day
});

store.on("error", function (e) {
  console.log("❌ SESSION STORE ERROR", e);
});

const sessionOption = {
  store,
  secret: process.env.SESSION_SECRET || "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
};

app.use(session(sessionOption));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash + current user middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null;
  next();
});

// ---------------- Routes ----------------

// Signup
app.get("/signup", (req, res) => {
  res.render("users/signup");
});

app.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);

    req.flash("success", "Account created successfully! 🎉");
    res.redirect("/listing");
  } catch (err) {
    if (err.name === "UserExistsError") {
      req.flash("error", "Username already exists. Please choose another.");
      return res.redirect("/signup");
    }
    console.error(err);
    req.flash("error", "Something went wrong during signup.");
    res.redirect("/signup");
  }
});

// Login
app.get("/login", (req, res) => {
  res.render("users/login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listing");
  }
);

// Logout
app.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "Logged you out!");
    res.redirect("/listing");
  });
});

// Home
// Home
app.get("/", async (req, res) => {
  const allListings = await listing.find({});
  res.render("listings/index", { allListings });
});


// Listings
app.get("/listing", async (req, res) => {
  const allListings = await listing.find({});
  res.render("listings/index", { allListings });
});

app.get("/listings/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const Listing = await listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  // 🔹 If no listing found
  if (!Listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listing");
  }

  // 🔹 If listing found
  res.render("listings/show", { Listing });
});


app.post("/listings", isLoggedIn, async (req, res) => {
  const newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listing");
});

app.get("/listings/:id/edit", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  const Listing = await listing.findById(id);
  res.render("listings/edit", { Listing });
});

app.put("/listings/:id", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listing");
});

// Reviews
app.post("/listings/:id/review", isLoggedIn, async (req, res) => {
  try {
    const foundListing = await listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();

    foundListing.reviews.push(newReview._id);
    await foundListing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${req.params.id}`);
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).send("Something went wrong.");
  }
});

app.delete(
  "/listings/:id/reviews/:reviewID",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewID } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
  })
);

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
