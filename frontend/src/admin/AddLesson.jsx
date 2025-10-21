import { useState, useEffect, useContext } from "react";
import API from "../api/api";
import { UserContext } from "../context/UserContext";
import "../dashboard/Dashboard.css";

const AdminLessons = () => {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("video");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [lessons, setLessons] = useState([]);

  // Fetch courses created by this admin
  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      const myCourses = res.data.filter(
        (course) => course.instructor_id === user.id
      );
      setCourses(myCourses);
      if (myCourses.length > 0) setSelectedCourseId(myCourses[0].id); // default select first
    } catch (err) {
      alert("Failed to fetch courses");
    }
  };

  // Fetch lessons for selected course
  const fetchLessons = async (courseId) => {
    if (!courseId) return;
    try {
      const res = await API.get(`/lessons/course/${courseId}`);
      setLessons(res.data);
    } catch (err) {
      alert("Failed to fetch lessons");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchLessons(selectedCourseId);
  }, [selectedCourseId]);

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return alert("Please select a course first");

    try {
      await API.post("/lessons", {
        course_id: selectedCourseId,
        title,
        type,
        url,
        content,
      });
      alert("Lesson added!");
      setTitle("");
      setUrl("");
      setContent("");
      fetchLessons(selectedCourseId);
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to add lesson");
    }
  };

  return (
    <div className="card">
      <h3>Add Lesson</h3>
      <br />

      <label>Select Course:</label>
      <select
        value={selectedCourseId}
        onChange={(e) => setSelectedCourseId(e.target.value)}
      >
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
        ))}
      </select>
     <br />
     <br />
      <form onSubmit={handleAddLesson} className="form">
        <input
          placeholder="Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="video">Video</option>
          <option value="pdf">PDF</option>
          <option value="text">Text</option>
        </select>
        <input
          placeholder="URL (optional)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <textarea
          placeholder="Content (optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Add Lesson</button>
      </form>

      <h4 style={{ marginTop: "1.5rem" }}>Existing Lessons</h4>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            {lesson.title} ({lesson.type})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminLessons;
