/* eslint-disable no-undef */
import express from "express";
import cors from "cors";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";

import { router } from "./router/index.js";
import swaggerOptions from "./docs/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// 🌐 Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// 📁 Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// 🪵 Logs solo en desarrollo
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ❤️ Health check
app.get("/heart_check", (req, res) => {
  return res.json({ message: "Servidor (AUTH) en línea." });
});

// 🛣️ Rutas
app.use("/api/v1", router);

// 📚 Swagger
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

export default app;
