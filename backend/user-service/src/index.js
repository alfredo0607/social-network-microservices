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
  return res.json({ message: "Servidor (USER) en linea." });
});

// server .use("/api/v1", router);

serverHttps.listen(process.env.PORT, () => {
  console.log(
    `Servidor Express escuchando en el puerto (USER) ${process.env.PORT}`
  );
});
