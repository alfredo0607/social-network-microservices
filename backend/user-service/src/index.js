/* eslint-disable no-undef */
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";

const PORT = process.env.PORT || 3004;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
