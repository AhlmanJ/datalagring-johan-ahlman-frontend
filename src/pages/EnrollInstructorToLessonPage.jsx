import React, { useState, useEffect } from "react";

export default function RegisterInstructorPage() {
  const [courses, setCourses] = useState([]);  // Lista för kurser
  const [instructors, setInstructors] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");  // För vald kurs
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch courses, instructors, and lessons when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hämta kurser
        const coursesResponse = await fetch("https://localhost:7253/api/courses");
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);

        // Hämta instruktörer
        const instructorsResponse = await fetch("https://localhost:7253/api/instructors");
        const instructorsData = await instructorsResponse.json();
        setInstructors(instructorsData);

      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("An error occurred while fetching courses, instructors.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // När en kurs är vald, hämta tillhörande lektioner
  useEffect(() => {
    const fetchLessons = async () => {
      if (selectedCourse) {
        try {
          const lessonsResponse = await fetch(`https://localhost:7253/api/courses/${selectedCourse}/lessons`);
          const lessonsData = await lessonsResponse.json();
          setLessons(lessonsData);
        } catch (error) {
          console.error("Error fetching lessons:", error);
          setErrorMessage("An error occurred while fetching lessons for the selected course.");
        }
      }
    };

    fetchLessons();
  }, [selectedCourse]);  // Hämta lektioner när kursen ändras

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedInstructor || !selectedLesson) {
      setErrorMessage("Please select both an instructor and a lesson.");
      return;
    }

    try {
      const enrollResponse = await fetch(
        `https://localhost:7253/api/instructors/${selectedInstructor}/lesson/${selectedLesson}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!enrollResponse.ok) throw new Error("Error registering instructor to lesson");

      setMessage("Instructor successfully registered for the lesson!");
      setSelectedInstructor("");
      setSelectedLesson("");
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("An error occurred while registering the instructor.");
    }
  };

  return (
    <div className="registerInstructorPage">
      <div className="registerInstructor-container">
        <h1>Register Instructor to Lesson</h1>
        {message && <p className="success-message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="registerInstructor-form">
            <div className="form-group">
              <label htmlFor="course">Select Course:</label>
              <select
                id="course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="form-input"
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="instructor">Select Instructor:</label>
              <select
                id="instructor"
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="form-input"
                required
              >
                <option value="">Select an instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.instructorId} value={instructor.instructorId}>
                    {instructor.firstName} {instructor.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="lesson">Select Lesson:</label>
              <select
                id="lesson"
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="form-input"
                required
              >
                <option value="">Select a lesson</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="form-button">
              Register Instructor
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
