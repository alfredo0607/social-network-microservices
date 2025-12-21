import express from "express";
import expressUser from "./user.js";

const router = express.Router();

router.use("/user", expressUser);

export default router;
