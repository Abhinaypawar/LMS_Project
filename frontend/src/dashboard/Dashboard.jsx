// src/Dashboard.jsx
import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate,Link } from "react-router-dom";



// Admin Pages
// import CreateCourse from "./admin/CreateCourse";
import CreateCourse from "../admin/CreateCourse";
import MyCourses from "../admin/MyCourses";
import AddLesson from "../admin/AddLesson";

// Student Pages
import EnrollCourse from "../student/EnrollCourse";
import StudentMyCourses from "../student/MyCourses";
import QuizzesLessons from "../student/QuizzesLessons";

// Optional Navbar
// import Navbar from "./UI/Navbar";

import "./Dashboard.css"; // CSS same as before

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("dashboard");
   const navigate = useNavigate();
  if (!user) return <div>Loading user...</div>;

  const adminTabs = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Create Course", key: "createCourse" },
    { name: "My Courses", key: "myCourses" },
    { name: "Add Lesson", key: "addLesson" },
  ];

  const studentTabs = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Enroll Courses", key: "enrollCourses" },
    { name: "My Courses", key: "myCourses" },
    { name: "Quizzes & Learn", key: "quizzes" },
  ];
  console.log(user.role);
  const tabs = user.role === "Admin" ? adminTabs : studentTabs;

  const renderContent = () => {
    if (user.role === "Admin") {
      switch (activeTab) {
        case "dashboard":
          return <div className="card1">Welcome Admin {user.name}</div>;
        case "createCourse":
          return <CreateCourse />;
        case "myCourses":
          return <MyCourses/>;
        case "addLesson":
          return <AddLesson />;
        default:
          return <div>Select a tab</div>;
      }
    } else {
      switch (activeTab) {
        case "dashboard":
          return <div className="card1">Welcome {user.name}</div>;
        case "enrollCourses":
          return <EnrollCourse />;
        case "myCourses":
          return <StudentMyCourses />;
        case "quizzes":
          return <QuizzesLessons />;
        default:
          return <div>Select a tab</div>;
      }
    }
  };
 

  const handleLogout=(e)=>{
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");

  }

  return (
    <div className="admin-dashboard">
      <div className="admin-navbar">
        <div className="navbar-left">
          <span className="lms-logo">LMS</span>
        </div>
        <div className="navbar-center">Dashboard</div>
        <div className="navbar-right">
          {user ? `${user.name} (${user.role})` : "Loading..."}
        </div>
       <button onClick={handleLogout}>logout</button>
      </div>

      <div className="dashboard-main">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          {tabs.map((tab) => (
            
            <button
              key={tab.key}
              className={activeTab === tab.key ? "active" : ""}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="dashboard-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
