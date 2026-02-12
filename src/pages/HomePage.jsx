import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [courses, setCourses] = useState([]);
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

  return (
    <div className="homePage">
      <div className="homePage-container">
        <h1 className="courses-header">Available Courses</h1>
        {courses.length === 0 ? (
          <p>Inga kurser hittades</p>
        ) : (
          <div className="coursesTiles-wrapper">
            {courses.map((course) => (
              <div
                className="course-tile"
                key={course.id}
                onClick={() => navigate(`/courses/${course.id.toUpperCase()}/lessons`)} // Navigate to lessons for this course
                style={{ cursor: "pointer" }}
              >
                <h2>{course.name}</h2>
                <p>{course.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
