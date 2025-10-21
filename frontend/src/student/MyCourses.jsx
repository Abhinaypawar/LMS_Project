import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { UserContext } from "../context/UserContext";
import "../dashboard/Dashboard.css";

const CourseCard = ({ course }) => {
  // Play video on thumbnail click
  const handleThumbnailClick = (e) => {
    e.stopPropagation(); // Prevent any card click actions
    if (course.image_url?.includes("youtube.com")) {
      const videoId = course.image_url.split("v=")[1];
      window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
    } else if (course.image_url) {
      window.open(course.image_url, "_blank");
    } else {
      alert("No video available for this course");
    }
  };

  return (
    <div className="course-card">
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
        className="course-thumbnail"
        onClick={handleThumbnailClick} // Thumbnail click plays video
      />
      <h4 className="course-title">{course.title}</h4>
      <p className="course-desc">{course.description}</p>
      <span className="course-cat">Category: {course.category || "N/A"}</span>
    </div>
  );
};

const MyCourses = () => {
  const { user } = useContext(UserContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const fetchEnrolled = async () => {
    try {
      const res = await API.get(`/enrollments/student/${user.id}`);
      const enriched = await Promise.all(
        res.data.map(async (enrollment) => {
          try {
            const courseRes = await API.get(`/courses/${enrollment.course_id}`);
            return { ...enrollment, ...courseRes.data };
          } catch {
            return enrollment;
          }
        })
      );
      setEnrolledCourses(enriched);
    } catch (err) {
      alert("Failed to fetch enrolled courses");
    }
  };

  useEffect(() => {
    fetchEnrolled();
  }, []);

  return (
    <div className="card">
      <h3>My Courses</h3>
      {enrolledCourses.length === 0 && <p>No courses enrolled yet.</p>}
      <div className="card-container">
        {enrolledCourses.map((course) => (
          <CourseCard key={course.course_id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
