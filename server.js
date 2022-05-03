const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const app = express();

const BDSRouter = require("./src/routes/bds.route");
const config = require("./src/configs/general.config");

app.use(cors()).use(morgan("tiny")).use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/bds", BDSRouter);

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "BDS",
      version: "0.1.0",
      description:
        "This is a server made for a BDS project for the University of Ghent",
    },
    servers: [
      {
        url: `http://localhost:${config.port}/bds`,
        description: "BDS Server",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// set up rate limiter: maximum of five requests per minute
var RateLimit = require("express-rate-limit");
var limiter = new RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
});

// apply rate limiter to all requests
app.use(limiter);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

app.listen(config.port, () =>
  console.log(`App listening at http://localhost:${config.port}`)
);
