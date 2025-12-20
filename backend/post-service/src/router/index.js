import express from "express";
import routerPost from "./post.js";

const router = express.Router();

router.use("/post", routerPost);

export default router;
