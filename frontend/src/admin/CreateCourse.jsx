// src/admin/CreateCourse.jsx
import { useState, useContext, useEffect } from "react";
import API from "../api/api";
import { UserContext } from "../context/UserContext";

const CreateCourse = () => {
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [courses, setCourses] = useState([]);
  const [price, setPrice] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
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

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/courses", {
        title,
        description,
        category,
        instructor_id: user?.id,
        image_url: type,
        price,
      });
      alert("Course created successfully!");
      setTitle("");
      setDescription("");
      setCategory("");
      setType("video");
      fetchCourses();
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to create course");
    }
  };

  return (
    <div className="card">
      <h3>Create Course</h3>
      <form onSubmit={handleCreateCourse} className="form">
        <input
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          placeholder="ytlink"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price (in INR)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button type="submit">Create Course</button>
      </form>

      {/* Optional: List of courses
      {courses.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h4>My Courses:</h4>
          <ul>
            {courses.map((course) => (
              <li key={course.id}>
                <b>{course.title}</b> - {course.description} | Category: {course.category}
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default CreateCourse;
