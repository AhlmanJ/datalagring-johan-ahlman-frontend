import { useState, useEffect } from "react";

export default function CreateInstructor() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [expertise, setExpertise] = useState("");  // Expertise input field
  const [instructors, setInstructors] = useState([]);
  const [editingInstructorId, setEditingInstructorId] = useState(null); // For edit mode
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch instructors on component load
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch("https://localhost:7253/api/instructors");
        if (!response.ok) throw new Error("Error fetching instructors");
        const data = await response.json();
        setInstructors(data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    fetchInstructors();
  }, []);

  // Handle input changes
  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleExpertiseChange = (e) => setExpertise(e.target.value);  // Expertise input change handler

  // Handle submit for both create and update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !expertise) {
      setErrorMessage("All fields are required.");
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      expertise,  // Include expertise in the payload
    };

    try {
      if (editingInstructorId) {
        console.log("Editing instructor with ID:", editingInstructorId);  // Debugging log
        const response = await fetch(
          `https://localhost:7253/api/instructors/${editingInstructorId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        if (!response.ok) throw new Error("Error updating instructor");

        setMessage("Instructor updated successfully!");
      } else {
        // POST request to create a new instructor
        const response = await fetch("https://localhost:7253/api/instructors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Error creating instructor");

        setMessage("Instructor created successfully!");
      }

      // Reset form and refetch instructors after success
      setFirstName("");
      setLastName("");
      setEmail("");
      setExpertise("");  // Reset expertise
      setEditingInstructorId(null); // Reset to create mode

      const fetchResponse = await fetch("https://localhost:7253/api/instructors");
      const data = await fetchResponse.json();
      setInstructors(data);
    } catch (error) {
      console.error("Error during instructor create or update:", error);
      setErrorMessage(error.message);
    }
  };

  // Handle updating instructor
  const handleUpdateInstructor = (instructor) => {
    console.log("Editing Instructor ID:", instructor.instructorId);  // Debugging: Check the ID being passed
    setEditingInstructorId(instructor.instructorId);  // Set the instructor's ID for editing
    setFirstName(instructor.firstName);
    setLastName(instructor.lastName);
    setEmail(instructor.email);
    setExpertise(instructor.expertise);  // Set expertise for editing
  };

  // Handle deleting instructor
  const handleDeleteInstructor = async (instructorId) => {
    try {
      const response = await fetch(
        `https://localhost:7253/api/instructors/${instructorId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Error deleting instructor");

      setMessage("Instructor deleted successfully!");

      // Remove the instructor from the list locally
      setInstructors(instructors.filter((instructor) => instructor.instructorId !== instructorId));
    } catch (error) {
      console.error("Error deleting instructor:", error);
      setErrorMessage("Error deleting instructor, please try again.");
    }
  };

  console.log("Current editingInstructorId:", editingInstructorId);  // Debug: Check the current value of editingInstructorId

  return (
    <div className="createInstructorPage">
      <div className="createInstructor-container">
        <h1>{editingInstructorId ? "Edit Instructor" : "Create Instructor"}</h1>
        {message && <p className="success-message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Form for creating/updating instructor */}
        <form onSubmit={handleSubmit} className="createInstructor-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={handleFirstNameChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={handleLastNameChange}
              className="form-input"
              required
            />
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="expertise">Expertise:</label>
            <input
              type="text"
              id="expertise"
              value={expertise}
              onChange={handleExpertiseChange}  // Handle expertise change
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="form-button">
            {editingInstructorId ? "Update Instructor" : "Create Instructor"}
          </button>
        </form>

        {/* List of existing instructors */}
        <div className="instructor-list">
          <h2>Existing Instructors</h2>
          {instructors.length === 0 ? (
            <p>No instructors found.</p>
          ) : (
            <ul>
              {instructors.map((instructor) => (
                <li key={instructor.instructorId}> {/* Use instructorId as the key */}
                  <h3>{instructor.firstName} {instructor.lastName}</h3>
                  <p><strong>Email:</strong> {instructor.email}</p>
                  <p><strong>Expertise:</strong> {instructor.expertise}</p>  {/* Display expertise */}
                  <div className="instructor-actions">
                    <button
                      onClick={() => handleUpdateInstructor(instructor)}
                      className="update-button"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteInstructor(instructor.instructorId)}
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
