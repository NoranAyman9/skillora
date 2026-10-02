const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const commentRoutes = require("./routes/commentRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const progressRoutes = require("./routes/progressRoutes");

const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();


// ==========================
// Security
// ==========================

app.use(helmet());


// ==========================
// CORS
// ==========================

app.use(cors());


// ==========================
// JSON
// ==========================

app.use(express.json());


// ==========================
// Rate Limiting
// ==========================

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message:
      "Too many requests, please try again later.",
  },
});

app.use(generalLimiter);


// ==========================
// Swagger
// ==========================

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


// ==========================
// Home
// ==========================

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Skillora API",
  });
});


// ==========================
// Routes
// ==========================

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api", lessonRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api", commentRoutes);
app.use("/api", ratingRoutes);
app.use("/api", progressRoutes);


// ==========================
// 404
// ==========================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});


// ==========================
// Error Middleware
// ==========================

app.use(errorMiddleware);


module.exports = app;