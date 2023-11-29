import express from "express";
import mw from "../middlewares";

const router = express.Router();

router.get(
  "/",
  mw.log("ping"),
  mw[200]("pong"),
);

export default router;