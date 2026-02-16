import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateLesson() {
  const [lessonName, setLessonName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [lessons, setLessons] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // <-- for storing backend error messages
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [email, setEmail] = useState(""); 
  const navigate = useNavigate();

  // Help function to fetch with backend error handling
  const fetchWithBackendError = async (url, options) => {
    const res = await fetch(url, options);

    // If response is not ok, try to parse backend error message
    if (!res.ok) {
      let errData = {};
      try {
        errData = await res.json();
      } catch {}
      throw new Error(errData.detail || errData.title || `HTTP error ${res.status}`);
    }

    // If response is ok, return JSON or null
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  };

  // get courses on load
  useEffect(() => {
    fetchWithBackendError("https://localhost:7253/api/courses")
      .then((data) => setCourses(data))
      .catch((err) => setErrorMessage(err.message));
  }, []);

  // Fetch lessons when courseId changes
  useEffect(() => {
    if (courseId) {
      fetchWithBackendError(`https://localhost:7253/api/courses/${courseId}/lessons`)
        .then((data) => setLessons(data))
        .catch((err) => setErrorMessage(err.message));
    }
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedCourseId = courseId.toUpperCase();
    const payload = {
      name: lessonName,
      startDate,
      endDate,
      maxCapacity: capacity,
      locationName: location,
    };

    try {
      if (editingLessonId) {
        await fetchWithBackendError(`https://localhost:7253/api/courses/lessons/${editingLessonId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setMessage("Lesson updated successfully!");
        setEditingLessonId(null);
        setLessonName("");
        setStartDate("");
        setEndDate("");
        setCapacity("");
      } else {
        await fetchWithBackendError(`https://localhost:7253/api/courses/createLesson/${formattedCourseId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setMessage("Lesson created successfully!");
        setLessonName("");
        setStartDate("");
        setEndDate("");
        setCapacity("");
        setLocation("");
      }
    } catch (error) {
      setErrorMessage(error.message); // <-- Display backend error message
    }
  };

  const handleUpdateLesson = (lesson) => {
    setEditingLessonId(lesson.id);
    setLessonName(lesson.name);
    setStartDate(lesson.startDate);
    setEndDate(lesson.endDate);
    setCapacity(lesson.maxCapacity);
    setLocation(lesson.location);
    setEmail(lesson.email);
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await fetchWithBackendError(`https://localhost:7253/api/courses/lessons/${lessonId}`, { method: "DELETE" });
      setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
      setMessage("Lesson deleted successfully!");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="create-lesson-page">
      <div className="create-lesson-container">
        <h1>{editingLessonId ? "Edit Lesson" : "Create / Edit Lesson"}</h1>
        {message && <p className="success-message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* <-- Dispaly backend error messages */}

        {/* Lesson creation form */}
        <form onSubmit={handleSubmit} className="lesson-form">
          <div className="form-group">
            <label htmlFor="course">Select Course:</label>
            <select id="course" value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
              <option value="">-- Select a course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="lessonName">Lesson Name:</label>
            <input type="text" id="lessonName" value={lessonName} onChange={(e) => setLessonName(e.target.value)} required={!editingLessonId} />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input type="datetime-local" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required={!editingLessonId} />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input type="datetime-local" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} required={!editingLessonId} />
          </div>
          <div className="form-group">
            <label htmlFor="capacity">Capacity:</label>
            <input type="number" id="capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} required={!editingLessonId} />
          </div>
          {!editingLessonId && (
            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
          )}
          <button type="submit">{editingLessonId ? "Update Lesson" : "Create Lesson"}</button>
        </form>

        {courseId && (
          <div className="lesson-list">
            <h2>Existing Lessons</h2>
            {lessons.length === 0 ? <p>No lessons available for this course.</p> : (
              <ul>
                {lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <h3>{lesson.name}</h3>
                    <p><strong>Start:</strong> {lesson.startDate}</p>
                    <p><strong>End:</strong> {lesson.endDate}</p>
                    <p><strong>Location:</strong> {lesson.location}</p>
                    <p><strong>Capacity:</strong> {lesson.maxCapacity}</p>
                    <div className="lesson-actions">
                      <button onClick={() => handleUpdateLesson(lesson)} className="update-button">Update</button>
                      <button onClick={() => handleDeleteLesson(lesson.id)} className="delete-button">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
