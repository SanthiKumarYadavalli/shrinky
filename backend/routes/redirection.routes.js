import express from "express";
import RedirectionController from "../controllers/redirection.controller.js";

const redirectionRouter = express.Router();
const redirectionController = new RedirectionController();

redirectionRouter.get("/:shortCode", redirectionController.redirect);

export default redirectionRouter;