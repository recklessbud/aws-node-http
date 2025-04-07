import { Router } from "express";
import { homePage, postToDb, redirectToLongUrl } from "../../controller/home.controller";
// import { cacheMiddleware } from "../../middleware/cache.middleware";

const router = Router();

router.get("/", homePage);
router.post("/", postToDb);
router.get("/:shortId", redirectToLongUrl);

export default router;