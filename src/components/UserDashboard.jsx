import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectUser, selectIsAdmin } from '../store/slice'
import api from '../RoleApi'
import CustomModal from "./CustomModal";
import CustomTable from "./CustomTable";
import '../styles/UserDashboard.css';

const UserDashboard = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalProps, setModalProps] = useState({ mode: 'create', userId: null, initialData: null });
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = useSelector(selectUser);
    const isAdmin = useSelector(selectIsAdmin);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (isAdmin) {
                // Admin: Get all users
                const response = await api.get('/');
                setUsers(response.data.data || []);
            } else {
                // User: Get only their own data
                const response = await api.get('/me');
                setCurrentUser(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.response?.data?.error || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => { setModalProps({ mode: 'create', userId: null, initialData: null }); setShowModal(true); };
    const openEditModal = (userData) => {
        setModalProps({
            mode: 'edit',
            userId: userData._id,
            initialData: { name: userData.name, email: userData.email, role: userData.role }
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        fetchData(); // Refresh data after adding user
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            await api.delete(`/delete/${userId}`);
            alert('User deleted successfully!');
            fetchData(); // Refresh the list
        } catch (err) {
            console.error('Error deleting user:', err);
            alert(err.response?.data?.error || 'Failed to delete user');
        }
    };

    const handleEditUser = async (userId, updatedData) => {
        try {
            await api.put(`/update/${userId}`, updatedData);
            alert('User updated successfully!');
            fetchData(); // Refresh the list
        } catch (err) {
            console.error('Error updating user:', err);
            alert(err.response?.data?.error || 'Failed to update user');
        }
    };

    if (loading) {
        return <div className="main-content"><p>Loading...</p></div>;
    }

    if (error && !currentUser && users.length === 0) {
        return <div className="main-content"><p>Error: {error}</p></div>;
    }

    return (
        <div className="main-content">
            <h1>{isAdmin ? 'Admin Dashboard' : 'User Dashboard'}</h1>
            <p>Welcome back, {user?.name || 'User'}. Here's what's happening today.</p>

            {isAdmin && (
                <button className="create-usr-btn" onClick={openModal}>Add User</button>
            )}

            <div className="cards">
                <div className="card">
                    <h3>Active Users</h3>
                    <p className="project-count">24</p>
                </div>
                <div className="card empty-card"></div>
            </div>

            {/* Admin: Show all users table */}
            {isAdmin && (
                <CustomTable
                    users={users}
                    onEditStart={openEditModal}
                    onDelete={handleDeleteUser}
                    currentUserId={user?.id}
                />
            )}


            {/* User: Show own profile */}
            {!isAdmin && currentUser && (
                <div className="users-table-container">
                    <h2>Your Profile</h2>

                    <table className="users-table profile-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{currentUser.name}</td>
                                <td>{currentUser.email}</td>
                                <td>{currentUser.role}</td>
                                <button
                                    onClick={() => {
                                        setModalProps({
                                            mode: "edit",
                                            userId: currentUser._id,
                                            initialData: {
                                                name: currentUser.name,
                                                email: currentUser.email,
                                                role: currentUser.role,
                                            },
                                        });
                                        setShowModal(true);
                                    }}
                                    className="edit-btn"
                                >
                                    Edit Profile
                                </button>
                            </tr>

                        </tbody>
                    </table>

                </div>
            )}

            {showModal && (
                <CustomModal
                    onClose={closeModal}
                    mode={modalProps.mode}
                    userId={modalProps.userId}
                    initialData={modalProps.initialData}
                />
            )}
        </div>
    )
}

export default UserDashboard
