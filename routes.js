import express from "express";
import { authorization } from "./src/token/index.js";
const router = express.Router();

import User from "./src/controllers/user.controller.js";

//authentication


router.post("/onboard", User.onboard);
router.post("/login", User.login);
router.get("/users", User.gerAll);
router.get("/user", authorization, User.currentUser);
router.put("/update/:id", authorization, User.updateProfile);
router.post("/resetPass", authorization, User.resetPass);
router.delete("/delete/:id", User.deleteUser);

export default router;
