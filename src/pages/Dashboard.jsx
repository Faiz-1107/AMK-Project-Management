import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Projects from "../components/Projects";
import Settings from "../components/Settings";
import UserDashboard from "../components/UserDashboard";
import '../styles/Dashboard.css';

const Dashboard = () => {
    // Function to render content based on route
    const showComponent = () => {
        const path = window.location.pathname;
        if (path.endsWith('/projects')) {
            return <Projects />;
        }
        if (path.endsWith('/settings')) {
            return <Settings />;
        }
        return <UserDashboard />;
    };

    return (
        <>
            <div className="dashboard-container">
                <Sidebar />
                <div className="dashboard-main">
                    <Navbar />
                    {showComponent()}
                </div>
            </div>
        </>
    )
}

export default Dashboard
