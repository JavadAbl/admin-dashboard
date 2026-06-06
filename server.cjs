const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Middleware to restrict /login to POST only
server.use("/login", (req, res, next) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed",
      message: "Only POST method is allowed on /login",
    });
  }
  next();
});

server.use(router);

server.listen(3000, () => {
  console.log("JSON Server is running on port 3000");
});
