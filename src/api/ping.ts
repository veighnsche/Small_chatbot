import express from "express";
import mw from "../middlewares";

const router = express.Router();

router.get(
  "/",
  mw[200]({ message: "pong" }),
);

export default router;