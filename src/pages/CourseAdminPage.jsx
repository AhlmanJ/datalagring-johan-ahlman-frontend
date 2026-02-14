import { useState, useEffect } from "react";

export default function CreateCourse() {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null); // For edit mode
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch the list of courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://localhost:7253/api/courses");
        if (!response.ok) throw new Error("Error fetching courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Handle course name input change
  const handleCourseNameChange = (e) => {
    setCourseName(e.target.value);
  };

  // Handle course description input change
  const handleCourseDescriptionChange = (e) => {
    setCourseDescription(e.target.value);
  };

  // Submit handler for both creating and updating courses
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
      if (editingCourseId) {
        // PUT request to update course
        const response = await fetch(
          `https://localhost:7253/api/courses/${editingCourseId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) throw new Error("Error updating course");

        setMessage("Course updated successfully!");
      } else {
        // POST request to create a new course
        const response = await fetch("https://localhost:7253/api/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Error creating course");

        setMessage("Course created successfully!");
      }

      // Reset form fields and state
      setCourseName("");
      setCourseDescription("");
      setEditingCourseId(null); // Reset to create mode after successful operation

      // Refetch courses after create or update
      const response = await fetch("https://localhost:7253/api/courses");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error during course creation or update:", error);
      setErrorMessage(error.message);
    }
  };

  // Handle updating course
  const handleUpdateCourse = (course) => {
    setEditingCourseId(course.id); // Set the course ID for editing
    setCourseName(course.name);
    setCourseDescription(course.description);
  };

  // Handle deleting course
  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(
        `https://localhost:7253/api/courses/${courseId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Error deleting course");

      setMessage("Course deleted successfully!");

      // Remove the course from the list locally
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
      setErrorMessage("Error deleting course, please try again.");
    }
  };

  return (
    <div className="createCoursePage">
      <div className="createCourse-container">
        <h1>{editingCourseId ? "Edit Course" : "Create Course"}</h1>
        {message && <p className="success-message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Form for creating/updating course */}
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
            {editingCourseId ? "Update Course" : "Create Course"}
          </button>
        </form>

        {/* List of existing courses */}
        <div className="course-list">
          <h2>Existing Courses</h2>
          {courses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            <ul>
              {courses.map((course) => (
                <li key={course.id}>
                  <h3>{course.name}</h3>
                  <p><strong>Description:</strong> {course.description}</p>
                  <div className="course-actions">
                    <button
                      onClick={() => handleUpdateCourse(course)}
                      className="update-button"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
