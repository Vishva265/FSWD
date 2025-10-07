// Not-found handler
export function notFound(req, res, _next) {
  res.status(404).json({ error: "Route not found" });
}

// Central error handler
export function errorHandler(err, _req, res, _next) {
  console.error(err);
  // Mongoose validation & cast errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "ValidationError",
      details: Object.fromEntries(
        Object.entries(err.errors).map(([k, v]) => [k, v.message])
      )
    });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  res.status(err.status || 500).json({ error: err.message || "Server error" });
}
