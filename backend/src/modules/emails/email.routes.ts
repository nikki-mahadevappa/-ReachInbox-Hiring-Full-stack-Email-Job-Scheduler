import { Router } from "express";
import {
  scheduleEmail,
  getScheduledEmails,
  getSentEmails,
} from "./email.controller";

const router = Router();

router.post("/schedule", scheduleEmail);
router.get("/scheduled", getScheduledEmails);
router.get("/sent", getSentEmails);

export default router;
