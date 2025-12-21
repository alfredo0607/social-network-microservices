import express from "express";
import expressUser from "./user";

const router = express.Router();

router.use("/user", expressUser);

export default router;
