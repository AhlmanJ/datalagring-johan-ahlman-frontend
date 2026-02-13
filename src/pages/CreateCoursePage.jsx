import React, { useState } from "react";

export default function CreateCourse() {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCourseNameChange = (e) => {
    setCourseName(e.target.value);
    console.log("Course Name changed to:", e.target.value); // Logga ändringar i kursnamnet
  };

  const handleCourseDescriptionChange = (e) => {
    setCourseDescription(e.target.value);
    console.log("Course Description changed to:", e.target.value); // Logga ändringar i kursbeskrivningen
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Kontrollera att både kursnamn och beskrivning är ifyllda
    if (!courseName || !courseDescription) {
      setErrorMessage("Both fields are required.");
      console.log("Validation failed: Both fields are required."); // Logga valideringsfel
      return;
    }

    const payload = {
      name: courseName,
      description: courseDescription,
    };

    console.log("Payload to be sent:", payload); // Logga payload innan förfrågan skickas

    try {
      const response = await fetch("https://localhost:7253/api/courses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response received:", response); // Logga serverns svar

      if (!response.ok) {
        throw new Error("Error creating course");
      }

      const data = await response.json();
      console.log("Course created:", data); // Logga det skapade kursdata

      setCourseName(""); // Rensa kursnamnet
      setCourseDescription(""); // Rensa beskrivningen
      setMessage("Course created successfully!");
      setErrorMessage(""); // Rensa felmeddelande om framgång

    } catch (error) {
      console.error("Error during course creation:", error); // Logga fel
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
