// src/student/EnrollCourse.jsx
import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { UserContext } from "../context/UserContext";
import "../dashboard/Dashboard.css"; // Reuse existing CSS


const CourseCard = ({
  course,
  onEnroll,
  isEnrolled,
  onUnenroll,
  loadingUnenroll,
}) => (
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
    />

    <h4 className="course-title">Title: {course.title}</h4>
    <p className="course-desc">Description: {course.description}</p>
    <span className="course-cat">Category: {course.category || "N/A"}</span>
    <span className="course-price">
      Price: {course.price > 0 ? `₹${course.price}` : "Free"}
    </span>
    {!isEnrolled ? (
      <button className="enroll-btn" onClick={() => onEnroll(course)}>
        Enroll Now
      </button>
    ) : (
      <button
        className="unrolled-btn"
        onClick={() => onUnenroll(course.id)}
        disabled={loadingUnenroll}
      >
        {loadingUnenroll ? "Processing..." : "Unenroll"}
      </button>
    )}
  </div>
);

const EnrollCourse = () => {
  const { user, setRefreshMyCourses } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingUnenrollFor, setLoadingUnenrollFor] = useState(null);
  // const {  } = useContext(UserContext);

  // fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (err) {
      alert("Failed to fetch courses");
    }
  };

  // fetch enrolled courses of this student
  const fetchEnrolled = async () => {
    try {
      const res = await API.get(`/enrollments/student/${user.id}`);
      setEnrolledCourses(res.data);
    } catch (err) {
      alert("Failed to fetch enrolled courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courses.length > 0) fetchEnrolled();
  }, [courses]);

  const handleEnroll = async (course) => {
    try {
      if (course.price > 0) {
        // 1. Create order on backend
        const orderRes = await API.post("/payments/create-order", {
          student_id: user.id,
          course_id: course.id,
          amount: course.price,
        });

        const { order_id, amount, currency } = orderRes.data;

        const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;

        if (!razorpayKey) {
          alert("Razorpay key missing in frontend!");
          return;
        }

        // 2. Razorpay options
        const options = {
          key: razorpayKey, // frontend key id
          amount: amount, // in paise (backend already converted)
          currency: currency,
          name: "E-Learning Platform",
          description: course.title,
          order_id: order_id,
          prefill: {
            // helps reduce user typing
            name: user?.name || "Student",
            email: user?.email || "",
            contact: user?.phone || "",
          },
          method: {
            // <-- DISABLE UPI here
            card: true,
            netbanking: true,
            upi: false, // <-- important: disable UPI
            wallet: false,
          },
          handler: async function (response) {
            // Payment success
            try {
              // you can also send response to backend for verification if needed
              await API.post(
                `/enrollments/?student_id=${user.id}&course_id=${course.id}`
              );
              // alert("Payment successful! You are enrolled in this course.");
              setRefreshMyCourses((prev) => !prev);
              fetchEnrolled();
            } catch (err) {
              console.error("Enroll after payment failed:", err);
              // alert("Enrollment failed after payment");
            }
          },
          modal: {
            ondismiss: function () {
              alert("Payment cancelled");
            },
          },
        };

        // 3. Open checkout
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Free course
        await API.post(
          `/enrollments/?student_id=${user.id}&course_id=${course.id}`
        );
        // alert("Enrolled successfully!");
        setRefreshMyCourses((prev) => !prev);
        fetchEnrolled();
      }
    } catch (err) {
      console.error("handleEnroll error:", err);
      alert(err?.response?.data?.detail || "Something went wrong");
    }
  };

  const handleUnenroll = async (courseId) => {
    // const ok = window.confirm(
    //   "Are you sure you want to unenroll from this course?"
    // );
    // if (!ok) return;

    try {
      setLoadingUnenrollFor(courseId);
      await API.delete(
        `/enrollments?student_id=${user.id}&course_id=${courseId}`
      );

      // alert("You have been unenrolled.");
      setRefreshMyCourses((prev) => !prev);
      await fetchEnrolled();
    } catch (err) {
      console.error("Unenroll error:", err);
      alert(err?.response?.data?.detail || "Failed to unenroll");
    } finally {
      setLoadingUnenrollFor(null);
    }
  };

  return (
    <div className="card">
      <h3>All Courses</h3>
      <div className="card-container">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEnroll={handleEnroll}
            onUnenroll={handleUnenroll}
            // isEnrolled={enrolledCourses.some((c) => c.course_id === course.id)}
            isEnrolled={enrolledCourses.some((c) => c.course_id === course.id)}
            loadingUnenroll={loadingUnenrollFor === course.id}
          />
        ))}
      </div>
    </div>
  );
};

export default EnrollCourse;
