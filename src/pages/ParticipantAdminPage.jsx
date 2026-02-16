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
  const [editingParticipantId, setEditingParticipantId] = useState(null);
  const navigate = useNavigate();

  // Helper to extract backend error message (ProblemDetails support)
  const getErrorMessage = async (response) => {
    try {
      const errorData = await response.json();
      return (
        errorData.detail ||
        errorData.title ||
        errorData.message ||
        "Something went wrong"
      );
    } catch {
      return "Something went wrong";
    }
  };

  // Fetch participants on load
  useEffect(() => {
    fetch("https://localhost:7253/api/participants")
      .then((res) => res.json())
      .then((data) => {
        setParticipants(data || []);
      })
      .catch((err) =>
        console.error("Error fetching participants:", err)
      );
  }, []);

  // Handle phone number changes (only used in create mode)
  const handlePhoneChange = (index, value) => {
    const updated = [...phoneNumbers];
    updated[index] = value;
    setPhoneNumbers(updated);
  };

  const addPhoneNumberField = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("");

      if (editingParticipantId) {
        // Update WITHOUT touching phone numbers
        const res = await fetch(
          `https://localhost:7253/api/participants/${email}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName,
              lastName,
            }),
          }
        );

        if (!res.ok) {
          const errorMessage = await getErrorMessage(res);
          throw new Error(errorMessage);
        }

        setMessage("Participant updated successfully!");
        setMessageType("success");
      } else {
        // Create WITH phone numbers
        const res = await fetch(
          "https://localhost:7253/api/participants",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName,
              lastName,
              email,
              phonenumber: phoneNumbers.filter(
                (p) => p.trim() !== ""
              ),
            }),
          }
        );

        if (!res.ok) {
          const errorMessage = await getErrorMessage(res);
          throw new Error(errorMessage);
        }

        setMessage("Participant created successfully!");
        setMessageType("success");
      }

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumbers([]);
      setEditingParticipantId(null);

      // Refresh list
      const refreshed = await fetch(
        "https://localhost:7253/api/participants"
      );
      const refreshedData = await refreshed.json();
      setParticipants(refreshedData || []);
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    }
  };

  // Edit participant
  const handleUpdateParticipant = (participant) => {
    setEditingParticipantId(participant.email);
    setFirstName(participant.firstName);
    setLastName(participant.lastName);
    setEmail(participant.email);
    setPhoneNumbers(participant.phonenumber || []);
  };

  // Delete participant
  const handleDeleteParticipant = async (participantEmail) => {
    try {
      const response = await fetch(
        `https://localhost:7253/api/participants/${participantEmail}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
      }

      setParticipants(
        participants.filter((p) => p.email !== participantEmail)
      );

      setMessage("Participant deleted successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  };

  return (
    <div className="createParticipantPage">
      <div className="createParticipant-container">
        <h1 className="createParticipant-title">
          {editingParticipantId
            ? "Edit Participant"
            : "Create Participant"}
        </h1>

        {message && (
          <p
            className={
              messageType === "success"
                ? "success-message"
                : "error-message"
            }
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="createParticipant-form">
          <div className="form-group">
            <label>First name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Last name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="form-input"
            />
          </div>

          {!editingParticipantId ? (
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Email (read-only):</label>
              <input
                type="email"
                value={email}
                readOnly
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label>Phone numbers:</label>

            {phoneNumbers.map((phone, index) => (
              <input
                key={index}
                type="text"
                value={phone}
                readOnly={editingParticipantId !== null}
                onChange={(e) =>
                  handlePhoneChange(index, e.target.value)
                }
                className="form-input"
                style={
                  editingParticipantId
                    ? {
                        backgroundColor: "#f0f0f0",
                        cursor: "not-allowed",
                      }
                    : {}
                }
              />
            ))}

            {!editingParticipantId && (
              <button
                type="button"
                onClick={addPhoneNumberField}
                className="add-phone-btn"
              >
                Add Phone Number
              </button>
            )}
          </div>

          <button type="submit" className="form-button">
            {editingParticipantId
              ? "Update Participant"
              : "Create Participant"}
          </button>
        </form>

        <div className="participant-list">
          <h2>Existing Participants</h2>
          {participants.length === 0 ? (
            <p>No participants found.</p>
          ) : (
            <ul>
              {participants.map((participant) => (
                <li key={participant.email}>
                  <h3>
                    {participant.firstName}{" "}
                    {participant.lastName}
                  </h3>
                  <p>
                    <strong>Email:</strong>{" "}
                    {participant.email}
                  </p>
                  <p>
                    <strong>Phone Numbers:</strong>{" "}
                    {participant.phonenumber &&
                    participant.phonenumber.length > 0
                      ? participant.phonenumber.join(", ")
                      : "No phone numbers"}
                  </p>
                  <div className="participant-actions">
                    <button
                      onClick={() =>
                        handleUpdateParticipant(participant)
                      }
                      className="update-button"
                    >
                      Update
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteParticipant(
                          participant.email
                        )
                      }
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
