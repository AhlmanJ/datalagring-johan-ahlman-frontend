import { useState, useEffect } from "react";

export default function CreateInstructor() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [expertise, setExpertise] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [editingInstructorId, setEditingInstructorId] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch all instructors
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch("https://localhost:7253/api/instructors");
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.detail || "Error fetching instructors");
        }
        const data = await response.json();
        setInstructors(data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
        setErrorMessage(error.message);
      }
    };
    fetchInstructors();
  }, []);

  // Handle form input changes
  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleExpertiseChange = (e) => setExpertise(e.target.value);

  // Handle submit for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !expertise) {
      setErrorMessage("All fields are required.");
      return;
    }

    const payload = { firstName, lastName, email, expertise };

    try {
      let response;

      if (editingInstructorId) {
        // Update instructor
        response = await fetch(
          `https://localhost:7253/api/instructors/${editingInstructorId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.detail || "Error updating instructor");
        }

        setMessage("Instructor updated successfully!");
      } else {
        // Create instructor
        response = await fetch("https://localhost:7253/api/instructors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.detail || "Error creating instructor");
        }

        setMessage("Instructor created successfully!");
      }

      // Reset form and reload instructors
      setFirstName(""); 
      setLastName(""); 
      setEmail(""); 
      setExpertise(""); 
      setEditingInstructorId(null);

      const fetchResponse = await fetch("https://localhost:7253/api/instructors");
      const data = await fetchResponse.json();
      setInstructors(data);

    } catch (error) {
      console.error("Error during instructor create or update:", error);
      setErrorMessage(error.message);
    }
  };

  // Populate form for editing
  const handleUpdateInstructor = (instructor) => {
    setEditingInstructorId(instructor.instructorId);
    setFirstName(instructor.firstName);
    setLastName(instructor.lastName);
    setEmail(instructor.email);
    setExpertise(instructor.expertise);
  };

  // Delete instructor
  const handleDeleteInstructor = async (instructorId) => {
    try {
      const response = await fetch(
        `https://localhost:7253/api/instructors/${instructorId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || "Error deleting instructor");
      }

      setMessage("Instructor deleted successfully!");
      setInstructors(instructors.filter((i) => i.instructorId !== instructorId));
    } catch (error) {
      console.error("Error deleting instructor:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="createInstructorPage">
      <div className="createInstructor-container">
        <h1>{editingInstructorId ? "Edit Instructor" : "Create Instructor"}</h1>
        {message && <p className="success-message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="createInstructor-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input type="text" id="firstName" value={firstName} onChange={handleFirstNameChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input type="text" id="lastName" value={lastName} onChange={handleLastNameChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={handleEmailChange} 
              className="form-input" 
              required 
              readOnly={!!editingInstructorId} // Make email read-only when editing
            />
          </div>

          <div className="form-group">
            <label htmlFor="expertise">Expertise:</label>
            <input type="text" id="expertise" value={expertise} onChange={handleExpertiseChange} className="form-input" required />
          </div>

          <button type="submit" className="form-button">
            {editingInstructorId ? "Update Instructor" : "Create Instructor"}
          </button>
        </form>

        <div className="instructor-list">
          <h2>Existing Instructors</h2>
          {instructors.length === 0 ? <p>No instructors found.</p> : (
            <ul>
              {instructors.map((instructor) => (
                <li key={instructor.instructorId}>
                  <h3>{instructor.firstName} {instructor.lastName}</h3>
                  <p><strong>Email:</strong> {instructor.email}</p>
                  <p><strong>Expertise:</strong> {instructor.expertise}</p>
                  <div className="instructor-actions">
                    <button onClick={() => handleUpdateInstructor(instructor)} className="update-button">Update</button>
                    <button onClick={() => handleDeleteInstructor(instructor.instructorId)} className="delete-button">Delete</button>
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
