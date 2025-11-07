
import React from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import Swal from "sweetalert2";
import '../styles/CustomTable.css';

const CustomTable = ({ users, onEditStart, onDelete, currentUserId }) => {
  if (!users || users.length === 0) {
    return null;
  }

  // Toastify function
  const showToast = (message, type = "success") => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "center",
      style: {
        background: type === "success" ? "#22c55e" : "#ef4444",
        color: "#fff",
        borderRadius: "8px",
        fontSize: "14px",
        padding: "10px 18px",
      },
    }).showToast();
  };

  // Handle delete with toast
  const handleDelete = async (userId) => {
    try {
      const res = await onDelete(userId);
      showToast(res?.data?.message || "User deleted successfully!", "success");
    } catch (error) {
      showToast("Failed to delete user!", "error");
    }
  };
  
  // SweetAlert confirmation
  const confirmDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", 
      cancelButtonColor: "#6b7280",  
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id); 
        Swal.fire({
          title: "Deleted!",
          text: "User has been deleted successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="users-table-container">
      <h2>All Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isCurrentUser = u._id.toString() === currentUserId?.toString();
            return (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    onClick={() => onEditStart && onEditStart(u)}
                    className="edit-btn"
                  >
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>

                  {!isCurrentUser ? (
                    <button
                      onClick={() => confirmDelete(u._id)}
                      className="delete-btn"
                    >
                      <i className="fas fa-trash-alt"></i>
                      Delete
                    </button>
                  ) : (
                    <button
                      className="delete-btn disabled-delete-btn"
                      disabled
                    >
                      <i className="fas fa-trash-alt"></i>
                      Delete
                    </button>
                  )}

                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
