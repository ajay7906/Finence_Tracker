import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useContext(AuthContext);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    email: "",
    role: "user"
  });

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://finence-tracker-2.onrender.com/api/users/get`, {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({
      email: user.email,
      role: user.role
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const updateUser = async (userId) => {
    try {
      const res = await axios.put(
        `https://finence-tracker-2.onrender.com/api/users/update/${userId}`,
        editForm,
        { withCredentials: true }
      );
      
      setSuccess("User updated successfully");
      setEditingUser(null);
      fetchUsers(); // Refresh the user list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || "Error updating user");
    }
  };

//   const deleteUser = async (userId) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
    
//     try {
//       await axios.delete(
//         `https://finence-tracker-2.onrender.com/api/users/delete/${userId}`,
//         { withCredentials: true }
//       );
      
//       setSuccess("User deleted successfully");
//       fetchUsers(); // Refresh the user list
      
//       // Clear success message after 3 seconds
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.msg || "Error deleting user");
//     }
//   };



const deleteUser = async (userId, event) => {
    // Prevent any default behavior that might interfere
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Use a more modern confirmation dialog approach
    const isConfirmed = alert('Are you sure you want to delete this user? This action cannot be undone.');
    if (!isConfirmed) return;
    
    try {
      await axios.delete(
        `https://finence-tracker-2.onrender.com/api/users/delete/${userId}`,
        { withCredentials: true }
      );
      
      setSuccess("User deleted successfully");
      fetchUsers(); // Refresh the user list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || "Error deleting user");
    }
  };










  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({ email: "", role: "user" });
  };

  const formatRole = (role) => {
    const roleStyles = {
      admin: "bg-purple-100 text-purple-800",
      user: "bg-blue-100 text-blue-800",
      "read-only": "bg-gray-100 text-gray-800"
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleStyles[role] || "bg-gray-100 text-gray-800"}`}>
        {role}
      </span>
    );
  };

  if (!user || user.role !== "admin") {
    return null; // Don't render anything if user is not admin
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700 mb-8">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="ml-4 text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <div className="w-2 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
        User Management
      </h2>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/20 border border-green-500/30 text-green-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {success}
          </div>
        </div>
      )}
      
      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p>No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Email</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Role</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Created</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem._id} className="border-b border-gray-800 last:border-0">
                  <td className="px-4 py-3">
                    {editingUser === userItem._id ? (
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      />
                    ) : (
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-bold">
                            {userItem.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span>{userItem.email}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingUser === userItem._id ? (
                      <select
                        name="role"
                        value={editForm.role}
                        onChange={handleEditChange}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="read-only">Read Only</option>
                      </select>
                    ) : (
                      formatRole(userItem.role)
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(userItem.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {editingUser === userItem._id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateUser(userItem._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(userItem)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(userItem._id, e)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                          disabled={userItem._id === user._id}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;