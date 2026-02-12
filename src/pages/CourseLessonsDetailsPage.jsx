import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LessonsPage() {
  const { courseId } = useParams();  // Get course-ID from the URL-parameter
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simple date format function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // You can customize the format here
  };

  useEffect(() => {
    // Check that courseId is not undefined (debug)
    console.log("Course ID:", courseId);

    // Check if courseId is defined before sending the request
    if (!courseId) {
      console.error("Course ID is undefined");
      return;
    }

    // Send fetch request to the correct API endpoint
    fetch(`https://localhost:7253/api/courses/${courseId}/lessons`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Lektioner hämtade:", data);
        setLessons(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [courseId]);  // Rerun every time courseId changes

  if (loading) {
    return <p>Laddar lektioner...</p>;
  }

  return (
    <div className="lessonsPage">
      <h1>Lektioner för kurs: <div className="course-id">{courseId}</div></h1>
      <div>
        {lessons.length === 0 ? (
          <p>Inga lektioner hittades för denna kurs.</p>
        ) : (
          <div className="lessonsTiles-wrapper">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="lesson-tile">
                <h3>{lesson.name}</h3>
                <p>{formatDate(lesson.startDate)} - {formatDate(lesson.endDate)}</p>
                <p>Kapacitet: {lesson.maxCapacity}</p>
                <p>Platser lediga: {lesson.maxCapacity - lesson.enrolled}</p>
                <p>Kursnamn: {lesson.courseName}</p>
                <p>Plats: {lesson.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

