/* eslint-disable no-undef */
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
// import { prisma } from "./database/db.js";
// import { seed } from "./database/seed.js";
import { router } from "./router/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./docs/index.js";

const PORT = process.env.PORT || 3001;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(fileUpload());

server.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  server.use(morgan("dev"));
}

const serverHttps = http.createServer(server);

server.get("/heart_check", (req, res) => {
  return res.json({ message: "Servidor (AUTH) en linea." });
});

server.use("/", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

server.use("/api/v1", router);

serverHttps.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// async function initializeApp() {
//   try {
//     const userCount = await prisma.user.count();

//     if (userCount === 0) {
//       console.log("🔍 Base de datos vacía, ejecutando seed...");
//       await seed();
//     }

//     // Iniciar servidor
//     serverHttps.listen(PORT, () => {
//       console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
//       console.log(`📊 Usuarios en BD: ${userCount}`);
//     });
//   } catch (error) {
//     console.error("❌ Error al inicializar la aplicación:", error);
//     process.exit(1);
//   }
// }

// initializeApp();
