import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateParticipant() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 
  const [participants, setParticipants] = useState([]);  
  const [editingParticipantId, setEditingParticipantId] = useState(null);  // Used for edit mode
  const navigate = useNavigate();

  // Fetch participants on load
  useEffect(() => {
    fetch("https://localhost:7253/api/participants")
      .then((res) => res.json())
      .then((data) => {
        setParticipants(data || []);
        console.log("Participants data:", data);
      })
      .catch((err) => console.error("Error fetching participants:", err));
  }, []);

  // Handle phone numbers
  const handlePhoneChange = (index, value) => {
    const updated = [...phoneNumbers];
    updated[index] = value;
    setPhoneNumbers(updated);
  };

  const addPhoneNumberField = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  // Handle form submit for both creating and updating
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      firstName,
      lastName,
      email,
      phonenumber: phoneNumbers.filter((p) => p.trim() !== ""),
    };

    try {
      setMessage("");  // Reset any previous messages

      if (editingParticipantId) {
        // PUT request to update participant using email in the URL
        const res = await fetch(`https://localhost:7253/api/participants/${email}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,  // Send updated values
            lastName,
            phonenumber: phoneNumbers.filter((p) => p.trim() !== ""),
          }),
        });

        if (!res.ok) throw new Error("Error updating participant");

        setMessage("Participant updated successfully!");
        setMessageType("success");
      } else {
        // POST request to create new participant
        const res = await fetch("https://localhost:7253/api/participants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Error creating participant");

        setMessage("Participant created successfully!");
        setMessageType("success");
      }

      // Clear form after successful operation
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumbers([]);
      setEditingParticipantId(null);  // Reset to create mode after operation
    } catch (err) {
      setMessage(`Error: ${err.message}`);
      setMessageType("error");
    }
  };

  // Handle participant edit (when clicking "Update")
  const handleUpdateParticipant = (participant) => {
    console.log('Editing Participant Email:', participant.email);  // Use email for editing
    setEditingParticipantId(participant.email);  // Set email as editing identifier
    setFirstName(participant.firstName);
    setLastName(participant.lastName);
    setEmail(participant.email);
    setPhoneNumbers(participant.phoneNumbers || []);
  };

  // Handle participant delete
  const handleDeleteParticipant = async (participantEmail) => {
    try {
      const response = await fetch(`https://localhost:7253/api/participants/${participantEmail}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error deleting participant");

      setParticipants(participants.filter((p) => p.email !== participantEmail));
      setMessage("Participant deleted successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(`Error deleting participant: ${error.message}`);
      setMessageType("error");
    }
  };

  return (
    <div className="createParticipantPage">
      <div className="createParticipant-container">
        <h1 className="createParticipant-title">
          {editingParticipantId ? "Edit Participant" : "Create Participant"}
        </h1>

        {message && (
          <p className={messageType === "success" ? "success-message" : "error-message"}>
            {message}
          </p>
        )}

        {/* Form for creating/updating participant */}
        <form onSubmit={handleSubmit} className="createParticipant-form">
          <div className="form-group">
            <label htmlFor="firstName">First name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last name:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="form-input"
            />
          </div>

          {/* Email field only for create mode, not editable in update */}
          {!editingParticipantId && (
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
          )}

          {/* Read-only email field for update mode */}
          {editingParticipantId && (
            <div className="form-group">
              <label htmlFor="email">Email (read-only):</label>
              <input
                type="email"
                id="email"
                value={email}
                readOnly
                className="form-input"
              />
            </div>
          )}

          {/* Phone numbers */}
          <div className="form-group">
            <label htmlFor="phoneNumbers">Phone numbers:</label>
            {phoneNumbers.map((phone, index) => (
              <input
                key={index}
                type="text"
                value={phone}
                onChange={(e) => handlePhoneChange(index, e.target.value)}
                className="form-input"
              />
            ))}
            <button
              type="button"
              onClick={addPhoneNumberField}
              className="add-phone-btn"
            >
              Add Phone Number
            </button>
          </div>

          {/* Submit button */}
          <button type="submit" className="form-button">
            {editingParticipantId ? "Update Participant" : "Create Participant"}
          </button>
        </form>

        {/* Participant list */}
        <div className="participant-list">
          <h2>Existing Participants</h2>
          {participants.length === 0 ? (
            <p>No participants found.</p>
          ) : (
            <ul>
              {participants.map((participant) => (
                <li key={participant.email}>
                  <h3>{participant.firstName} {participant.lastName}</h3>
                  <p><strong>Email:</strong> {participant.email}</p>
                  <p><strong>Phone Numbers:</strong> {participant.phoneNumbers && participant.phoneNumbers.length > 0 ? participant.phoneNumbers.join(", ") : "No phone numbers"}</p>
                  <div className="participant-actions">
                    <button
                      onClick={() => handleUpdateParticipant(participant)}
                      className="update-button"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteParticipant(participant.email)}
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