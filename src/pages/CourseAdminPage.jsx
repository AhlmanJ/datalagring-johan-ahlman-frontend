import React, { useState, useEffect } from "react";

export default function CreateCourse() {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Fetch all courses when the component mounts
  useEffect(() => {
    fetch("https://localhost:7253/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setErrorMessage("Error loading courses. Please try again.");
      });
  }, []);

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

      // Reload courses after creating a new one
      setCourses([...courses, data]);

    } catch (error) {
      console.error("Error during course creation:", error);
      setErrorMessage("Error creating course, please try again.");
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourseId) {
      setErrorMessage("No course selected to update.");
      return;
    }

    const payload = {
      name: courseName,
      description: courseDescription,
    };

    try {
      const response = await fetch(
        `https://localhost:7253/api/courses/${selectedCourseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating course");
      }

      const data = await response.json();
      setCourseName("");
      setCourseDescription("");
      setMessage("Course updated successfully!");
      setErrorMessage(""); 

      // Update the course in the list
      setCourses(courses.map(course => 
        course.id === selectedCourseId ? data : course
      ));
    } catch (error) {
      console.error("Error during course update:", error);
      setErrorMessage("Error updating course, please try again.");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await fetch(`https://localhost:7253/api/courses/${courseId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Error deleting course");
        }

        setCourses(courses.filter((course) => course.id !== courseId));
        setMessage("Course deleted successfully!");
        setErrorMessage(""); 
      } catch (error) {
        console.error("Error during course deletion:", error);
        setErrorMessage("Error deleting course, please try again.");
      }
    }
  };

  return (
    <div className="createCoursePage">
      <div className="createCourse-container">
        <h1>{selectedCourseId ? "Update Course" : "Create Course"}</h1>
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
          <button type="submit" className="form-button">
            {selectedCourseId ? "Update Course" : "Create Course"}
          </button>
        </form>

        <h2>Manage Courses</h2>
        <div className="course-list">
          {courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="course-tile2">
                <p>{course.name}</p>
                <button
                  className="edit-course-btn"
                  onClick={() => {
                    setCourseName(course.name);
                    setCourseDescription(course.description);
                    setSelectedCourseId(course.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-course-btn"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
