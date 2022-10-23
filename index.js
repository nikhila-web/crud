import express from "express";
import mongoose from "mongoose";
import router from "./routes.js";
import config from "./config.js";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const app = express();

mongoose
  .connect(config.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((res) => console.log(`Connection Succesful `))
  .catch((err) => console.log(`Error in DB connection ${err}`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "crud API",
      version: "1.0.0",
      description: "A simple User API",
    },
    servers: [
      {
        url: "http://localhost:7000/api/v1",
      },
    ],
    security:[
      {
        bearerAuth:[]
      }
    ]
  },


  apis: ["./swagger/userdoc.js"],
  };

app.use("/api/v1/", router);
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.listen(config.SERVER_PORT, () => {
  console.log(`Application is listening at port ${config.SERVER_PORT}`);
});
