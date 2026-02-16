import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PhonenumbersAdmin() {
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [newPhone, setNewPhone] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  // Helper to handle backend ProblemDetails errors
  const fetchWithBackendError = async (url, options) => {
    const res = await fetch(url, options);

    if (!res.ok) {
      let errorData = {};
      try {
        errorData = await res.json();
      } catch {}
      throw new Error(
        errorData.detail ||
          errorData.title ||
          errorData.message ||
          `HTTP error ${res.status}`
      );
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  };

  // Load participants on mount
  useEffect(() => {
    fetchWithBackendError("https://localhost:7253/api/participants")
      .then((data) => setParticipants(data || []))
      .catch((err) => {
        setMessage(err.message);
        setMessageType("error");
      });
  }, []);

  // Select participant
  const handleSelectParticipant = (email) => {
    const participant = participants.find((p) => p.email === email);
    setSelectedParticipant(participant);
    setPhoneNumbers(participant?.phonenumber || []);
    setNewPhone("");
    setMessage("");
  };

  // Add phone number
  const handleAddPhone = async () => {
    if (!newPhone.trim() || !selectedParticipant) return;

    try {
      setMessage("");

      await fetchWithBackendError(
        `https://localhost:7253/api/participants/CreatePhonenumber?participantId=${selectedParticipant.participantId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phonenumber: newPhone }),
        }
      );

      // Refresh participant from backend
      const updatedParticipant = await fetchWithBackendError(
        `https://localhost:7253/api/participants/${selectedParticipant.email}`
      );

      setSelectedParticipant(updatedParticipant);
      setPhoneNumbers(updatedParticipant.phonenumber || []);
      setNewPhone("");

      setMessage("Phone number added successfully!");
      setMessageType("success");
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    }
  };

  // Remove phone number via new DELETE endpoint
  const handleRemovePhone = async (phone) => {
    if (!selectedParticipant) return;

    try {
      setMessage("");

      await fetchWithBackendError(
        `https://localhost:7253/api/participants/${selectedParticipant.participantId}/${phone}`,
        { method: "DELETE" }
      );

      // Remove from frontend state
      const updatedPhones = phoneNumbers.filter((p) => p !== phone);
      setPhoneNumbers(updatedPhones);

      setMessage("Phone number removed successfully!");
      setMessageType("success");
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    }
  };

  return (
    <div className="createParticipantPage">
      <div className="createParticipant-container">
        <h1 className="createParticipant-title">
          Manage Participant Phone Numbers
        </h1>

        {message && (
          <p
            className={
              messageType === "success" ? "success-message" : "error-message"
            }
          >
            {message}
          </p>
        )}

        <div className="form-group">
          <label>Select Participant:</label>
          <select
            value={selectedParticipant?.email || ""}
            onChange={(e) => handleSelectParticipant(e.target.value)}
            className="form-input"
          >
            <option value="">-- Select --</option>
            {participants.map((p) => (
              <option key={p.email} value={p.email}>
                {p.firstName} {p.lastName} ({p.email})
              </option>
            ))}
          </select>
        </div>

        {selectedParticipant && (
          <>
            <div className="form-group">
              <label>Phone Numbers:</label>
              {phoneNumbers.length === 0 && <p>No phone numbers</p>}

              {phoneNumbers.map((phone, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <input type="text" value={phone} readOnly className="form-input" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhone(phone)}
                    className="delete-button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Add New Phone Number:</label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                onClick={handleAddPhone}
                className="add-phone-btn"
              >
                Add
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
