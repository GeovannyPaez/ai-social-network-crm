import { Router } from "express";
import * as SessionController from "../controllers/SessionController";
import * as UserController from "../controllers/UserController";
import isAuth from "../middleware/isAuth";

const authRoutes = Router();

authRoutes.post("/signup", UserController.store);

authRoutes.post("/login", SessionController.store);

authRoutes.post("/refresh_token", SessionController.update);

authRoutes.delete("/logout", isAuth, SessionController.remove);


// authRoutes.get("/facebook", passport.authenticate("facebook", { scope: ['email'], session: false }));

// authRoutes.get("/facebook/callback", passport.authenticate("facebook",
//     { failureRedirect: "/login" }),
//     (req, res) => {
//         res.redirect("/");

//     }
// );
authRoutes.get("/success", (req, res) => {
    res.send("You have successfully logged in");
});

authRoutes.get("/fail", (req, res) => {
    res.send("You have failed to log in");
});

export default authRoutes;
