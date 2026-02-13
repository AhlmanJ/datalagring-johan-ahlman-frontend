import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateLesson() {
  const [lessonName, setLessonName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [courses, setCourses] = useState([]); // State för att hålla alla kurser
  const [courseId, setCourseId] = useState(""); // State för valt kurs-id
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Hämta alla kurser när komponenten laddas
  useEffect(() => {
    fetch("https://localhost:7253/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  const handleLessonNameChange = (e) => setLessonName(e.target.value);
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);
  const handleCapacityChange = (e) => setCapacity(e.target.value);
  const handleLocationChange = (e) => setLocation(e.target.value);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // check if all fields are filled out
    if (!lessonName || !startDate || !endDate || !capacity || !location || !courseId) {
      setErrorMessage("All fields are required.");
      return;
    }

    // convert courseId to uppercase to match backend expectations
    const formattedCourseId = courseId.toUpperCase();

    console.log("Submitting lesson creation with course ID:", formattedCourseId);

    const payload = {
      name: lessonName,
      startDate: startDate,
      endDate: endDate,
      maxCapacity: capacity,
      locationName: location,
    };

      console.log("Selected Course ID:", courseId); // Logga valt kurs-id för felsökning
      console.log("All courses data:", courses); // Logga alla kurser för felsökning
      console.log("Lesson Name:", lessonName);
      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);
      console.log("Capacity:", capacity);
      console.log("Location:", location);
      console.log("Payload being sent:", payload);

    try {
      const response = await fetch(`https://localhost:7253/api/courses/createLesson/${formattedCourseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error creating lesson");
      }
      
      const data = await response.json();
      setLessonName("");
      setStartDate("");
      setEndDate("");
      setCapacity("");
      setLocation("");
      setMessage("Lesson created successfully!");
      setErrorMessage(""); // Clear error message

      // Navigate to the lessons page for the selected course
      navigate(`/courses/${formattedCourseId}/lessons`);
    } catch (error) {
      console.error("Error during lesson creation:", error);
      setErrorMessage("Error creating lesson, please try again.");
    }
  };

  return (
    <div className="createCoursePage">
      <div className="createCourse-container">
        <h1>Create Lesson</h1>
        {message && <p className="success-message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="createCourse-form">
          {/* Dropdown to select course */}
          <div className="form-group">
            <label htmlFor="course">Select Course:</label>
            <select
              id="course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)} 
              className="form-input"
              required
            >
              <option value="">-- Select a course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="lessonName">Lesson Name:</label>
            <input
              type="text"
              id="lessonName"
              value={lessonName}
              onChange={handleLessonNameChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="datetime-local"
              id="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="datetime-local"
              id="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="capacity">Capacity:</label>
            <input
              type="number"
              id="capacity"
              value={capacity}
              onChange={handleCapacityChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={handleLocationChange}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="form-button">Create Lesson</button>
        </form>
      </div>
    </div>
  );
}
