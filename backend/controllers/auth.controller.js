import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";

const register = async (req, res) => {
  const { email, password, role = "user" } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ msg: "Password must be at least 6 characters" });
  }

  try {
    // ✅ Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'user'
      )
    `);

    const hashed = await bcrypt.hash(password, 12);

    // ✅ PostgreSQL syntax with RETURNING
    const result = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id",
      [email, hashed, role]
    );

    const userId = result.rows[0].id;

    const token = jwt.sign(
      { id: userId, role },
      'ABCD1234!@#$%',  // 👈 replace with process.env.JWT_SECRET in production
      { expiresIn: "7d" }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        user: { id: userId, email, role },
        token
      });

  } catch (err) {
    if (err.code === '23505') { // unique_violation in PostgreSQL
      return res.status(409).json({ msg: "Email already exists" });
    }
  return res.status(500).json({ 
  msg: "Registration failed", 
  error: err.message,   // 👈 readable error
  code: err.code || null 
});

  }
};


// const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ msg: "Email and password are required" });
//   }

//   try {
//     const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    
//     if (!rows.length || !(await bcrypt.compare(password, rows[0].password))) {
//       return res.status(401).json({ msg: "Invalid credentials" });
//     }

//     const user = rows[0];
//     const token = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     return res
//       .cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       })
//       .json({ 
//         success: true, 
//         message: "Login successful",
//         user: { id: user.id, email: user.email, role: user.role },
//         token
//       });
//   } catch (err) {
//     return res.status(500).json({ msg: "Login failed", error: err.message });
//   }
// };




const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      msg: "Email and password are required" 
    });
  }

  try {
    const result = await pool.query(
      "SELECT id, email, password, role FROM users WHERE email = $1", 
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        msg: "Invalid credentials" 
      });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        msg: "Invalid credentials" 
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      'ABCD1234!@#$%',  // 👈 replace with process.env.JWT_SECRET in production
      { expiresIn: "7d" }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ 
        success: true, 
        message: "Login successful",
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        },
        token
      });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ 
      success: false,
      msg: "Login failed", 
      error: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
    });
  }
};




const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ success: true, message: "Logged out successfully" });
};

export { register, login, logout };