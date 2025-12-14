const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const authRoutes = require("./routes/auth.routes");
const authenticate = require("./middlewares/auth.middleware");
const authorizeRole = require("./middlewares/role.middleware");
const sweetRoutes = require("./routes/sweet.routes");

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || '*'
    : 'http://localhost:5173'
}));

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Sweet Shop API is running",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

// Protected test route
app.get("/api/protected", authenticate, (req, res) => {
  res.status(200).json({ message: "Protected content" });
});

// ADMIN-only route
app.get(
  "/api/admin",
  authenticate,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.status(200).json({ message: "Admin content" });
  }
);

// Serve static files from the React app if a build is present.
// This avoids relying solely on NODE_ENV and fixes deployments where
// the build exists but NODE_ENV isn't set to 'production'.
const frontendPath = path.join(__dirname, '../frontend/dist');
console.log('🔍 Frontend path:', frontendPath);
console.log('🔍 Frontend exists:', fs.existsSync(frontendPath));

if (fs.existsSync(frontendPath)) {
  console.log('✅ Serving frontend from:', frontendPath);
  app.use(express.static(frontendPath));

  // Handle React routing - return index.html for all non-API routes
  // Use middleware compatible with Express 5.
  app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return next();
    }
    console.log('📄 Serving index.html for:', req.path);
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  console.log('⚠️  Frontend build not found at:', frontendPath);
}

// 404 handler for API routes only (if not in production)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      method: req.method,
      path: req.path
    });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

module.exports = app;
