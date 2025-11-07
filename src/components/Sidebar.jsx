import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, selectUser, selectUserRole } from '../store/slice'
import '@fortawesome/fontawesome-free/css/all.min.css';

import '../styles/Sidebar.css'

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const role = useSelector(selectUserRole);

    const roleDisplay = role === 'admin' ? 'Admin' : 'User';

    const handleSignOut = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <div className="sidebar">
            <p className="role">Role: {roleDisplay}</p>
            <ul>
                <li onClick={() => navigate('/dashboard')}>
                    <i className="fa fa-line-chart" style={{ marginRight: '8px' }}></i>
                    Dashboard
                </li>
                <li onClick={() => navigate('/dashboard/projects')} >
                    <i className="fa fa-folder" style={{ marginRight: '8px' }}></i>
                    Projects
                    </li>
                {role === 'admin' && (
                    <li onClick={() => navigate('/dashboard/users')}>
                        <i className="fa fa-users" style={{ marginRight: '8px' }}></i>
                        Users
                    </li>
                )}
                <li onClick={() => navigate('/dashboard/settings')}>
                    <i className="fa fa-cog" style={{ marginRight: '8px' }}></i>
                    Settings
                </li>

            </ul>
            <button className="signout-btn" onClick={handleSignOut}>
                <i className="fa fa-sign-out" style={{ marginRight: '8px' }}></i>
                Sign Out
            </button>
        </div>
    )
}

export default Sidebar
