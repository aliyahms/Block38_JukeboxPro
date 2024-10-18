// Import Express and Create Auth router
const express = require("express");
const router = express.Router();

//Import JSON Token
const jwt = require("jsonwebtoken");
// Grab the JWT SECRET key
const JWT_SECRET = process.env.JWT_SECRET;

// Create Token for the user
function createToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
}
// Import prisma client
const prisma = require("../prisma");

// Finds User according to token
router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7); // "Bearer <token>"
  if (!token) return next();

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUniqueOrThrow({ where: { id } });
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
});

// POST Register Route
// creates a new User with the provided credentials and sends a token
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.register(username, password);
    const token = createToken(user.id);
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
});

// POST Login Route
// sends a token if the provided credentials are valid
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.login(username, password);
    const token = createToken(user.id);
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

/** Checks the request for an authenticated user. */
function authenticate(req, res, next) {
  if (req.user) {
    next();
  } else {
    next({ status: 401, message: "You must be logged in." });
  }
}

module.exports = {
  router,
  authenticate, // we want to export authenticate function to use
};
