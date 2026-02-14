import React, { useState, useEffect } from "react";

function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch the list of enrollments on component mount
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await fetch("https://localhost:7253/api/enrollments");
        if (!response.ok) throw new Error("Error fetching enrollments");
        const data = await response.json();
        setEnrollments(data);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
        setErrorMessage("Failed to load enrollments.");
      }
    };

    fetchEnrollments();
  }, []);

  return (
    <div className="enrollmentPage">
      <div className="enrollment-container">
        <h1 className="AllEnrollmetsH1">All Enrollments</h1>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* List of enrollments */}
        <div className="enrollment-list">
          {enrollments.length === 0 ? (
            <p>No enrollments found.</p>
          ) : (
            <div className="enrollment-grid">
              {enrollments.map((enrollment) => (
                <div className="enrollment-card" key={enrollment.enrollmentId}>
                  <h3>{enrollment.firstName} {enrollment.lastName}</h3>
                  <p><strong>Email:</strong> {enrollment.email}</p>
                  <p><strong>Lesson Name:</strong> {enrollment.lessonName}</p>
                  <p><strong>Lesson Location:</strong> {enrollment.lessonLocation}</p>
                  <p><strong>Enrollment Date:</strong> {new Date(enrollment.enrollmentDate).toLocaleString()}</p>
                  <p><strong>Start Date:</strong> {new Date(enrollment.startDate).toLocaleString()}</p>
                  <p><strong>End Date:</strong> {new Date(enrollment.endDate).toLocaleString()}</p>
                  <p><strong>Status:</strong> {enrollment.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnrollmentsPage;