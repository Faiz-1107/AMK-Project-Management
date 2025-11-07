import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../store/slice'
import '../styles/Navbar.css';

const Navbar = () => {
    const user = useSelector(selectUser);

    // Generate initials for avatar
    const userName = user?.name || 'User';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <nav className="top-nav">
            <div className="right-nav">
                <h2 className="app-title">AlMukarramah</h2>
            </div>
            <div className="left-nav">
                <input type="text" className="search-bar" placeholder="Search..." />
                <div className="lang-select">
                    <span>
                        <i className="fa fa-language" style={{ marginRight: '8px' }}></i>
                    </span>
                    <select>
                        <option>EN</option>
                        <option>FR</option>
                        <option>ES</option>
                    </select>
                </div>

                <div className="notification">
                    <span className="bell">
                        <i className="fa fa-bell"></i>
                    </span>
                </div>

                <div className="user-profile">
                    <div className="avatar">{initials}</div>
                    <span className="username">{userName} ▾</span>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
