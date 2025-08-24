// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { pool } from "../config/database.js";

// const register = async (req, res) => {
//   const { email, password, role = "user" } = req.body;

//   // Validation
//   if (!email || !password) {
//     return res.status(400).json({ msg: "Email and password are required" });
//   }

//   if (password.length < 6) {
//     return res.status(400).json({ msg: "Password must be at least 6 characters" });
//   }

//   try {
//     // ✅ Ensure table exists
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         email VARCHAR(255) UNIQUE NOT NULL,
//         password TEXT NOT NULL,
//         role VARCHAR(50) DEFAULT 'user'
//       )
//     `);

//     const hashed = await bcrypt.hash(password, 12);

//     // ✅ PostgreSQL syntax with RETURNING
//     const result = await pool.query(
//       "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id",
//       [email, hashed, role]
//     );

//     const userId = result.rows[0].id;

//     const token = jwt.sign(
//       { id: userId, role },
//       'ABCD1234!@#$%',  // 👈 replace with process.env.JWT_SECRET in production
//       { expiresIn: "7d" }
//     );

//     return res
//       .cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       })
//       .status(201)
//       .json({
//         success: true,
//         message: "User registered successfully",
//         user: { id: userId, email, role },
//         token
//       });

//   } catch (err) {
//     if (err.code === '23505') { // unique_violation in PostgreSQL
//       return res.status(409).json({ msg: "Email already exists" });
//     }
//   return res.status(500).json({ 
//   msg: "Registration failed", 
//   error: err.message,   // 👈 readable error
//   code: err.code || null 
// });

//   }
// };


// // const login = async (req, res) => {
// //   const { email, password } = req.body;

// //   if (!email || !password) {
// //     return res.status(400).json({ msg: "Email and password are required" });
// //   }

// //   try {
// //     const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    
// //     if (!rows.length || !(await bcrypt.compare(password, rows[0].password))) {
// //       return res.status(401).json({ msg: "Invalid credentials" });
// //     }

// //     const user = rows[0];
// //     const token = jwt.sign(
// //       { id: user.id, role: user.role },
// //       process.env.JWT_SECRET,
// //       { expiresIn: "7d" }
// //     );

// //     return res
// //       .cookie("token", token, {
// //         httpOnly: true,
// //         secure: process.env.NODE_ENV === "production",
// //         sameSite: "strict",
// //         maxAge: 7 * 24 * 60 * 60 * 1000,
// //       })
// //       .json({ 
// //         success: true, 
// //         message: "Login successful",
// //         user: { id: user.id, email: user.email, role: user.role },
// //         token
// //       });
// //   } catch (err) {
// //     return res.status(500).json({ msg: "Login failed", error: err.message });
// //   }
// // };




// const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ 
//       success: false,
//       msg: "Email and password are required" 
//     });
//   }

//   try {
//     const result = await pool.query(
//       "SELECT id, email, password, role FROM users WHERE email = $1", 
//       [email]
//     );
    
//     if (result.rows.length === 0) {
//       return res.status(401).json({ 
//         success: false,
//         msg: "Invalid credentials" 
//       });
//     }

//     const user = result.rows[0];
//     const isPasswordValid = await bcrypt.compare(password, user.password);
    
//     if (!isPasswordValid) {
//       return res.status(401).json({ 
//         success: false,
//         msg: "Invalid credentials" 
//       });
//     }

//     const token = jwt.sign(
//       { id: user.id, role: user.role },
//       'ABCD1234!@#$%',  // 👈 replace with process.env.JWT_SECRET in production
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
//         user: { 
//           id: user.id, 
//           email: user.email, 
//           role: user.role 
//         },
//         token
//       });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ 
//       success: false,
//       msg: "Login failed", 
//       error: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
//     });
//   }
// };




// const logout = (req, res) => {
//   res.clearCookie("token");
//   return res.json({ success: true, message: "Logged out successfully" });
// };

// export { register, login, logout };




























import express from "express";
import { pool } from "../config/database.js";
import { authenticate, requireRole } from "../middleware/authMiddleware.js"; // Make sure this path is correct

const router = express.Router();

// GET /api/users/get - Get all users (admin only)
router.get("/get", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ 
      success: false,
      msg: "Failed to fetch users", 
      error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
      err: `${err.message} - Internal server error ${err}` // Include error message for development
    });
  }
});

// GET /api/users/get/:id - Get specific user (admin only)
router.get("/get/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "SELECT id, email, role, created_at FROM users WHERE id = $1",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        msg: "User not found" 
      });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ 
      success: false,
      msg: "Failed to fetch user", 
      error: process.env.NODE_ENV === "development" ? err.message : `${err.message} - Internal server error`,
      err: `${err.message}` // Include error message for development
    });
  }
});

// PUT /api/users/update/:id - Update user (admin only)
router.put("/update/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;
    
    // Validate input
    if (!email || !role) {
      return res.status(400).json({ 
        success: false,
        msg: "Email and role are required" 
      });
    }
    
    if (!["admin", "user", "read-only"].includes(role)) {
      return res.status(400).json({ 
        success: false,
        msg: "Invalid role. Must be admin, user, or read-only" 
      });
    }
    
    // Check if user exists
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [id]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        msg: "User not found" 
      });
    }
    
    // Check if email is already taken by another user
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [email, id]
    );
    
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ 
        success: false,
        msg: "Email already taken by another user" 
      });
    }
    
    // Update user
    const result = await pool.query(
      "UPDATE users SET email = $1, role = $2 WHERE id = $3 RETURNING id, email, role, created_at",
      [email, role, id]
    );
    
    res.json({
      success: true,
      message: "User updated successfully",
      user: result.rows[0]
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ 
      success: false,
      msg: "Failed to update user", 
      error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
      err: `${err.message}`
    });
  }
});

// DELETE /api/users/delete/:id - Delete user (admin only)
router.delete("/delete/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ 
        success: false,
        msg: "Cannot delete your own account" 
      });
    }
    
    // Check if user exists
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [id]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        msg: "User not found" 
      });
    }
    
    // Delete user (transactions will be handled by ON DELETE CASCADE if foreign key exists)
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    
    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ 
      success: false,
      msg: "Failed to delete user", 
      error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
      err: `${err.message}`
    });
  }
});

export default router;