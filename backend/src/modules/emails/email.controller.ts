import { Request, Response } from "express";
import pool from "../../config/db";
import { emailQueue } from "../../queues/email.queue";

/**
 * POST /emails/schedule
 * Save email in DB and add delayed job to BullMQ
 */
export const scheduleEmail = async (req: Request, res: Response) => {
  const { subject, body, recipients, scheduledAt } = req.body;

  // Basic validation
  if (!subject || !body || !recipients || !scheduledAt) {
    return res.status(400).json({
      error: "subject, body, recipients, and scheduledAt are required",
    });
  }

  try {
    // 1️⃣ Save email in DB
    const query = `
      INSERT INTO emails (subject, body, recipients, scheduled_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [subject, body, recipients, scheduledAt];
    const result = await pool.query(query, values);
    const email = result.rows[0];

    // 2️⃣ Add delayed job to BullMQ
    const delay =
      new Date(scheduledAt).getTime() - Date.now();

    await emailQueue.add(
      "send-email",
      { emailId: email.id },
      { delay: Math.max(delay, 0) }
    );

    // 3️⃣ Respond
    return res.status(201).json({
      message: "Email scheduled successfully",
      email,
    });
  } catch (error) {
    console.error("Schedule email error:", error);
    return res.status(500).json({
      error: "Failed to schedule email",
    });
  }
};

/**
 * GET /emails/scheduled
 */
export const getScheduledEmails = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      "SELECT * FROM emails WHERE status = 'scheduled' ORDER BY scheduled_at ASC"
    );
    return res.json(result.rows);
  } catch (error) {
    console.error("Fetch scheduled emails error:", error);
    return res.status(500).json({
      error: "Failed to fetch scheduled emails",
    });
  }
};

/**
 * GET /emails/sent
 */
export const getSentEmails = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      "SELECT * FROM emails WHERE status = 'sent' ORDER BY created_at DESC"
    );
    return res.json(result.rows);
  } catch (error) {
    console.error("Fetch sent emails error:", error);
    return res.status(500).json({
      error: "Failed to fetch sent emails",
    });
  }
};
