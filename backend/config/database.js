// import mysql from "mysql2/promise";

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   ssl: {
//     ca: Buffer.from(process.env.DB_CA, "base64").toString("utf-8"),
//     rejectUnauthorized: true,
//   },
// });

// export { pool };






import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres:Ajay7906%40.com@db.cjmfzhujlbqbysksjpqh.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false, // Supabase requires SSL
  },
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));

export { pool };









// import pg from "pg";

// const { Pool } = pg;

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: false,   // 👈 disable SSL for local supabase
// });

// pool.connect()
//   .then(() => console.log("✅ Connected to PostgreSQL (Local Supabase)"))
//   .catch((err) => console.error("❌ Database connection error:", err));

// export { pool };







// import pg from "pg";
// const { Pool } = pg;

// const pool = new Pool({
//   user: 'postgres',
//   password: 'Ajay7906@.com',
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   ssl: false,  // since you said local supabase
// });

// pool.connect()
//   .then(() => console.log("✅ Connected to PostgreSQL"))
//   .catch((err) => console.error("❌ Database connection error:", err));

// export { pool };
