import { Worker } from "bullmq";
import nodemailer from "nodemailer";
import pool from "../config/db";

// Create Ethereal transporter (once)
const transporterPromise = nodemailer.createTestAccount().then(
  (testAccount: nodemailer.TestAccount) =>
    nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
);

const worker = new Worker(
  "email-queue",
  async (job) => {
    const { emailId } = job.data;

    // 1️⃣ Fetch email from DB
    const result = await pool.query(
      "SELECT * FROM emails WHERE id = $1",
      [emailId]
    );

    if (result.rowCount === 0) {
      throw new Error("Email not found");
    }

    const email = result.rows[0];

    // 2️⃣ Send email
    const transporter = await transporterPromise;

    const info = await transporter.sendMail({
      from: '"ReachInbox" <no-reply@reachinbox.ai>',
      to: email.recipients.join(","),
      subject: email.subject,
      text: email.body,
    });

    console.log(
      "Email sent:",
      nodemailer.getTestMessageUrl(info)
    );

    // 3️⃣ Update DB status
    await pool.query(
      "UPDATE emails SET status = 'sent' WHERE id = $1",
      [emailId]
    );
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
    concurrency: 5,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed`, err);
});