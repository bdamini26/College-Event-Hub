import { Router, type IRouter } from "express";
import healthRouter from "./health";
import eventsRouter from "./events";
import registrationsRouter from "./registrations";
import categoriesRouter from "./categories";
import galleryRouter from "./gallery";

const router: IRouter = Router();

router.use(healthRouter);
router.use(eventsRouter);
router.use(registrationsRouter);
router.use(categoriesRouter);
router.use(galleryRouter);

export default router;
