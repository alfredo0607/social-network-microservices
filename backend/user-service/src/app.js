/* eslint-disable no-undef */
import express from "express";
import cors from "cors";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./docs/index.js";
import router from "./router/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/heart_check", (req, res) => {
  return res.json({ message: "Servidor (USER) en línea." });
});

app.use("/api/v1", router);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

export default app;
