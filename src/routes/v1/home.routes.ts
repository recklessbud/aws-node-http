import { Router } from "express";
import { homePage, postToDb, redirectToLongUrl } from "../../controller/home.controller";

const router = Router();

router.get("/", homePage);
router.post("/", postToDb);
router.get("/:shortUrl", redirectToLongUrl);

export default router;