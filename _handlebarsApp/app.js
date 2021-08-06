//require("dotenv/config");
require('dotenv').config();

const axios = require('axios');

require("./db");

const express = require("express");
const app = express();
require("./config")(app);


//ROUTES
const index = require("./routes/index.routes");
app.use("/", index);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const homeRoutes = require("./routes/home.routes");
app.use("/home", homeRoutes);

const searchRoutes = require("./routes/search.routes");
app.use("/search", searchRoutes);

const eventRoutes = require("./routes/event.routes");
app.use("/event", eventRoutes);


require("./error-handling")(app);

module.exports = app;
  
