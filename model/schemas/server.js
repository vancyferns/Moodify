import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mount routes
app.use("/api/auth", authRoutes);

// Debug: list registered routes
const listRoutes = (app) => {
  console.log("\nRegistered Routes:");
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(`  ${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log(
            `  ${Object.keys(handler.route.methods)} /api/auth${handler.route.path}`
          );
        }
      });
    }
  });
};
listRoutes(app);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});


// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import authRoutes from "./routes/auth.js";
// import cors from "cors";

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// app.use("/api/auth", authRoutes);

// // Debug: list registered routes
// app._router.stack.forEach((middleware) => {
//   if (middleware.route) {
//     console.log("Route:", middleware.route.path);
//   } else if (middleware.name === "router") {
//     middleware.handle.stack.forEach((handler) => {
//       const route = handler.route;
//       route && console.log("Route:", Object.keys(route.methods), route.path);
//     });
//   }
// });

// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// const PORT = process.env.PORT || 5002;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import authRoutes from "./routes/auth.js";
// import cors from "cors";

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// app.use("/api/auth", authRoutes);

// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// const PORT = process.env.PORT || 5002;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });