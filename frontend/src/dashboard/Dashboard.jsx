
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./Dashboard.css";

// Admin Pages
import CreateCourse from "../admin/CreateCourse";
import MyCourses from "../admin/MyCourses";
import AddLesson from "../admin/AddLesson";

// Student Pages
import EnrollCourse from "../student/EnrollCourse";
import StudentMyCourses from "../student/MyCourses";
import QuizzesLessons from "../student/QuizzesLessons";
// import MyCourses from "../student/MyCourses";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const navigate = useNavigate();

  //

  // Fetch all courses (for dashboard preview)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // --- inside component, replace the existing useEffect for fetchMyCourses with this ---
  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user || user.role !== "Student") return;
      try {
        const res = await API.get(`/enrollments/student/${user.id}`);
        const enrollments = res.data;

        const enriched = await Promise.all(
          enrollments.map(async (en) => {
            try {
              const courseRes = await API.get(`/courses/${en.course_id}`);
              return { ...en, course: courseRes.data };
            } catch {
              return { ...en, course: null };
            }
          })
        );

        setMyCourses(enriched);
      } catch (err) {
        console.error("Failed to fetch my courses:", err);
      }
    };

    fetchMyCourses();
  }, [user]);

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

  const tabs = user.role === "Admin" ? adminTabs : studentTabs;

  const renderContent = () => {
    if (user.role === "Admin") {
      switch (activeTab) {
        case "dashboard":
          return <div className="card1">Welcome Admin {user.name}</div>;
        case "createCourse":
          return <CreateCourse />;
        case "myCourses":
          return <MyCourses />;
        case "addLesson":
          return <AddLesson />;
        default:
          return <div>Select a tab</div>;
      }
    } else {
      switch (activeTab) {
        case "dashboard":
          return (
            <div className="card1">
              <h2>Welcome to LMS {user.name}</h2>
              <h3 style={{ marginTop: "20px" }}>Courses</h3>
              <div
                className="courses-row"
                style={{
                  display: "flex",
                  gap: "16px",
                  overflowX: "auto",
                  paddingBottom: "10px",
                }}
              >
                {courses.length === 0 ? (
                  <p>No courses available</p>
                ) : (
                  courses.map((course) => (
                    <div
                      onClick={() => setActiveTab("enrollCourses")}
                      key={course.id}
                      className="course-card"
                      style={{
                        minWidth: "180px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "8px",
                        background: "#fff",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: "180px", // reduced height
                        cursor: "pointer",
                        transition: "transform 0.2s ease-in-out",
                      }}
                    >
                      <img
                        src={
                          course.image_url?.includes("youtube.com")
                            ? `https://img.youtube.com/vi/${
                                course.image_url.split("v=")[1]
                              }/0.jpg`
                            : course.image_url ||
                              "https://via.placeholder.com/200x120?text=No+Image"
                        }
                        alt={course.title}
                        style={{
                          width: "100%",
                          height: "120px",
                          borderRadius: "6px",
                          objectFit: "cover",
                          marginBottom: "6px", // smaller gap
                        }}
                      />
                      <h4
                        style={{
                          fontSize: "15px",
                          fontWeight: "600",
                          color: "#333",
                          margin: "4px 0",
                          textAlign: "center",
                        }}
                      >
                          title: {course.title}
                      </h4>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#555",
                          margin: "2px 0",
                          textAlign: "center",
                        }}
                      >
                        discription: {course.description.length > 50
                          ? course.description.slice(0, 50) + "..."
                          : course.description}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <h3 style={{ marginTop: "20px" }}>My Courses</h3>

              <div
                className="mycourses-container"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "10px",
                }}
              >
                {myCourses.length === 0 ? (
                  <p>No courses enrolled yet.</p>
                ) : (
                  myCourses.map((en) => {
                    const course = en.course;
                    if (!course) return null;

                    return (
                      <div
                        key={en.id}
                        className="mycourse-card"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "650px",
                          minHeight: "30px",
                          border: "1px solid #ccc",
                          borderRadius: "10px",
                          padding: "10px 16px",
                          background: "#f1ededff",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "500",
                            color: "#333",
                          }}
                        >
                          {course.title}
                        </h4>

                        <button
                          onClick={() => setActiveTab("myCourses")}
                          style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Continue
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
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

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  };

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
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-main">
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

        <div className="dashboard-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
