import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { UserContext } from "../context/UserContext";
import "../dashboard/Dashboard.css"; 

const QuizzesLessons = () => {
  const { user } = useContext(UserContext);
  const [coursesWithLessons, setCoursesWithLessons] = useState([]);

  useEffect(() => {
    fetchCoursesAndLessons();
  }, []);

  const fetchCoursesAndLessons = async () => {
    try {
      // Get all enrolled courses
      const enrollRes = await API.get(`/enrollments/student/${user.id}`);
      const enriched = await Promise.all(
        enrollRes.data.map(async (enrollment) => {
          try {
            const courseRes = await API.get(`/courses/${enrollment.course_id}`);
            const lessonsRes = await API.get(`/lessons/course/${enrollment.course_id}`);
            return {
              ...courseRes.data,
              lessons: lessonsRes.data,
            };
          } catch {
            return { course_id: enrollment.course_id, title: "Unknown Course", lessons: [] };
          }
        })
      );
      setCoursesWithLessons(enriched);
    } catch (err) {
      alert("Failed to fetch courses and lessons");
    }
  };

  const handleLessonClick = (lesson) => {
    if (lesson.type === "video" && lesson.url) {
      window.open(lesson.url, "_blank");
    } else if (lesson.type === "pdf" && lesson.url) {
      window.open(lesson.url, "_blank");
    } else if (lesson.type === "text") {
      alert(lesson.content || "No text content available");
    }
  };

  return (
    <div className="card">
      <h3>My Courses & Lessons</h3>
      {coursesWithLessons.length === 0 && <p>No enrolled courses available.</p>}
      {coursesWithLessons.map((course) => (
        <div key={course.course_id} style={{ marginBottom: "2rem" }}>
          <h4 style={{ color: "#333" }}>{course.title}</h4>
          {course.lessons.length === 0 ? (
            <p>No lessons available.</p>
          ) : (
            <ul>
              {course.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  style={{ cursor: "pointer", padding: "4px", marginBottom: "3px" }}
                  onClick={() => handleLessonClick(lesson)}
                >
                  {lesson.title} ({lesson.type})
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuizzesLessons;
