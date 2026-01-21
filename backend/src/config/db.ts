import { Pool } from "pg";

const pool = new Pool({
  host: "127.0.0.1",
  port: 5433,
  user: "reachinbox",
  password: "reachinbox",
  database: "reachinbox_db",
  ssl: false,
});

export default pool;
