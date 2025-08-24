// import express from "express";
// import { pool } from "../config/database.js"; // Using CommonJS for compatibility
// import { authenticate, requireRole } from "../middleware/auth.js";

// const router = express.Router();

// // GET /api/users - Get all users (admin only)
// router.get("/get", authenticate, requireRole("admin"), async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT id, email, role, created_at FROM users ORDER BY created_at DESC"
//     );
    
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).json({ 
//       success: false,
//       msg: "Failed to fetch users", 
//       error: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
//     });
//   }
// });

// // GET /api/users/:id - Get specific user (admin only)
// router.get("/get/:id", authenticate, requireRole("admin"), async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const result = await pool.query(
//       "SELECT id, email, role, created_at FROM users WHERE id = $1",
//       [id]
//     );
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ 
//         success: false,
//         msg: "User not found" 
//       });
//     }
    
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error("Error fetching user:", err);
//     res.status(500).json({ 
//       success: false,
//       msg: "Failed to fetch user", 
//       error: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
//     });
//   }
// });

// // PUT /api/users/:id - Update user (admin only)
// router.put("update/:id", authenticate, requireRole("admin"), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { email, role } = req.body;
    
//     // Validate input
//     if (!email || !role) {
//       return res.status(400).json({ 
//         success: false,
//         msg: "Email and role are required" 
//       });
//     }
    
//     if (!["admin", "user", "read-only"].includes(role)) {
//       return res.status(400).json({ 
//         success: false,
//         msg: "Invalid role. Must be admin, user, or read-only" 
//       });
//     }
    
//     // Check if user exists
//     const userCheck = await pool.query(
//       "SELECT id FROM users WHERE id = $1",
//       [id]
//     );
    
//     if (userCheck.rows.length === 0) {
//       return res.status(404).json({ 
//         success: false,
//         msg: "User not found" 
//       });
//     }
    
//     // Check if email is already taken by another user
//     const emailCheck = await pool.query(
//       "SELECT id FROM users WHERE email = $1 AND id != $2",
//       [email, id]
//     );
    
//     if (emailCheck.rows.length > 0) {
//       return res.status(409).json({ 
//         success: false,
//         msg: "Email already taken by another user" 
//       });
//     }
    
//     // Update user
//     const result = await pool.query(
//       "UPDATE users SET email = $1, role = $2 WHERE id = $3 RETURNING id, email, role, created_at",
//       [email, role, id]
//     );
    
//     res.json({
//       success: true,
//       message: "User updated successfully",
//       user: result.rows[0]
//     });
//   } catch (err) {
//     console.error("Error updating user:", err);
//     res.status(500).json({ 
//       success: false,
//       msg: "Failed to update user", 
//       error: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
//     });
//   }
// });

// // DELETE /api/users/:id - Delete user (admin only)
// router.delete("delete/:id", authenticate, requireRole("admin"), async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Prevent admin from deleting themselves
//     if (parseInt(id) === req.user.id) {
//       return res.status(400).json({ 
//         success: false,
//         msg: "Cannot delete your own account" 
//       });
//     }
    
//     // Check if user exists
//     const userCheck = await pool.query(
//       "SELECT id FROM users WHERE id = $1",
//       [id]
//     );
    
//     if (userCheck.rows.length === 0) {
//       return res.status(404).json({ 
//         success: false,
//         msg: "User not found" 
//       });
//     }
    
//     // Delete user (transactions will be handled by ON DELETE CASCADE if foreign key exists)
//     await pool.query("DELETE FROM users WHERE id = $1", [id]);
    
//     res.json({
//       success: true,
//       message: "User deleted successfully"
//     });
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     res.status(500).json({ 
//       success: false,
//       msg: "Failed to delete user", 
//       error: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
//     });
//   }
// });

// export default router;














import express from "express";
import { pool } from "../config/database.js";
import { authenticate, requireRole } from "../middleware/authMiddleware.js";

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
      error: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
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
      error: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
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
      error: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
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
      error: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
    });
  }
});

export default router;