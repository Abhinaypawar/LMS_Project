// src/admin/MyCourses.jsx
import { useState, useContext, useEffect } from "react";
import API from "../api/api";
import { UserContext } from "../context/UserContext";
import "../dashboard/Dashboard.css"; // Reuse existing CSS
import "./MyCourses.css";
import axios from "axios";

const MyCourses = () => {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image_url: "",
  });

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      // Filter courses created by this instructor (admin)
      const myCourses = res.data.filter(
        (course) => course.instructor_id === user.id
      );
      setCourses(myCourses);
    } catch (err) {
      alert("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (courses.length === 0) {
    return (
      <div className="card">
        <p>No courses created yet.</p>
      </div>
    );
  }

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await API.delete(`/courses/${courseId}`);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      alert("Course deleted successfully!");
    } catch (err) {
      alert("Failed to delete course");
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      image_url: course.image_url,
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/courses/${selectedCourse.id}`, {
        ...formData,
        instructor_id: selectedCourse.instructor_id,
      });
      setIsModalOpen(false);
      fetchCourses();
      alert("Course updated successfully!");
    } catch (err) {
      alert("Failed to update course");
    }
  };

  return (
    <div className="card">
      <h3>My Courses</h3>
      <div className="card-container">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
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
            />
            <h4 className="course-title">Title: {course.title}</h4>
            <p className="course-desc">Description: {course.description}</p>
            <span className="course-cat">
              Category: {course.category || "N/A"}
            </span>
            <div className="card-buttons">
              <button 
              className="update-btn"
              onClick={() => handleEdit(course)}>Update</button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(course.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update Course</h3>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Course Title"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            ></textarea>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
            />
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Image URL"
            />
            <div className="modal-buttons">
              <button onClick={handleUpdate}>Save Changes</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
