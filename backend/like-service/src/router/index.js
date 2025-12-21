import express from "express";
import routeLike from "./like.js";

const route = express.Router();

route.use("/like", routeLike);

export default route;
