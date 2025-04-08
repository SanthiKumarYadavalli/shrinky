import express from "express";
import ClickController from "../controllers/click.controller.js";

const clickRouter = express.Router();
const clickController = new ClickController();

clickRouter.get("/:urlId", clickController.getClickData);

export default clickRouter;
