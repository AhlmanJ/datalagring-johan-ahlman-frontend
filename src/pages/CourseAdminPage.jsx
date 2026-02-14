import React, { useState } from "react";

export default function CreateCourse() {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const handleCourseNameChange = (e) => {
    setCourseName(e.target.value);
  };


  const handleCourseDescriptionChange = (e) => {
    setCourseDescription(e.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!courseName || !courseDescription) {
      setErrorMessage("Both fields are required.");
      return;
    }

    const payload = {
      name: courseName,
      description: courseDescription,
    };

    try {
      const response = await fetch("https://localhost:7253/api/courses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error creating course");
      }

      const data = await response.json();
      setCourseName(""); 
      setCourseDescription(""); 
      setMessage("Course created successfully!");
      setErrorMessage(""); 

    } catch (error) {
      console.error("Error during course creation:", error);
      setErrorMessage("Error creating course, please try again.");
    }
  };

  return (
    <div className="createCoursePage">
      <div className="createCourse-container">
        <h1>Create Course</h1>
        {message && <p className="success-message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="createCourse-form">
          <div className="form-group">
            <label htmlFor="courseName">Course Name:</label>
            <input
              type="text"
              id="courseName"
              value={courseName}
              onChange={handleCourseNameChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="courseDescription">Course Description:</label>
            <textarea
              id="courseDescription"
              value={courseDescription}
              onChange={handleCourseDescriptionChange}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="form-button">Create Course</button>
        </form>
      </div>
    </div>
  );
}