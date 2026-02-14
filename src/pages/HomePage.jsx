import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:7253/api/courses")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setCourses(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleCourseClick = async (courseId) => {
    try {
      // Hämta lektioner för den valda kursen
      const lessonsResponse = await fetch(`https://localhost:7253/api/courses/${courseId}/lessons`);
      const lessonsData = await lessonsResponse.json();

      if (lessonsData.length === 0) {
        // Visa meddelande om inga lektioner
        alert("Inga lektioner finns tillgängliga ännu.");
      } else {
        // Navigera till lektioner om det finns
        navigate(`/courses/${courseId.toUpperCase()}/lessons`);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
      setMessage("Error fetching lessons. Please try again.");
    }
  };

  return (
    <div className="homePage">
      <div className="homePage-container">
        <h1 className="courses-header">
          Available Courses <br /> Click on a course to view and book a lesson
        </h1>

        {courses.length === 0 ? (
          <p>No courses available.</p>
        ) : (
          <div className="coursesTiles-wrapper">
            {courses.map((course) => (
              <div
                className="course-tile"
                key={course.id}
                onClick={() => handleCourseClick(course.id)} // Hantera klick på kurs
                style={{ cursor: "pointer" }}
              >
                <h2>{course.name}</h2>
                <p>{course.description}</p>
              </div>
            ))}
          </div>
        )}

        {message && <p className="no-lessons-message">{message}</p>} {/* Visa meddelandet om inga lektioner */}
      </div>
    </div>
  );
}
