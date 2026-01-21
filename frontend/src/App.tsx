import React, { useEffect, useState } from "react";

type Email = {
  id: number;
  subject: string;
  body: string;
  recipients: string[];
  status: string;
  scheduled_at?: string;
  sent_at?: string;
};

function App() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipients, setRecipients] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const [scheduledEmails, setScheduledEmails] = useState<Email[]>([]);
  const [sentEmails, setSentEmails] = useState<Email[]>([]);

  const API = "http://localhost:3000";

  useEffect(() => {
    fetch(`${API}/emails/scheduled`)
      .then(res => res.json())
      .then(setScheduledEmails);

    fetch(`${API}/emails/sent`)
      .then(res => res.json())
      .then(setSentEmails);
  }, []);

  const scheduleEmail = async () => {
    await fetch(`${API}/emails/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject,
        body,
        recipients: recipients.split(","),
        scheduledAt
      })
    });

    alert("Email scheduled");
    window.location.reload();
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>ReachInbox – Email Scheduler</h1>

      <h2>Compose Email</h2>
      <input placeholder="Subject" onChange={e => setSubject(e.target.value)} /><br /><br />
      <textarea placeholder="Body" onChange={e => setBody(e.target.value)} /><br /><br />
      <input placeholder="Recipients (comma separated)" onChange={e => setRecipients(e.target.value)} /><br /><br />
      <input placeholder="YYYY-MM-DD HH:mm:ss" onChange={e => setScheduledAt(e.target.value)} /><br /><br />
      <button onClick={scheduleEmail}>Schedule</button>

      <hr />

      <h2>Scheduled Emails</h2>
      {scheduledEmails.map(e => (
        <div key={e.id}>
          {e.subject} — {e.status} — {e.scheduled_at}
        </div>
      ))}

      <hr />

      <h2>Sent Emails</h2>
      {sentEmails.map(e => (
        <div key={e.id}>
          {e.subject} — {e.status} — {e.sent_at}
        </div>
      ))}
    </div>
  );
}

export default App;
