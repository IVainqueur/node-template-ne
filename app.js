const express = require("express");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const morgan = require("./config/morgan");
const { jwtStrategy } = require("./config/passport");
const routes = require("./routes");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");

const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// v1 api routes
app.use("/", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
