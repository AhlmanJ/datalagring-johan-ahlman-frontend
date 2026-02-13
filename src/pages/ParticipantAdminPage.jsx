import { useState } from "react";

export default function CreateParticipant() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([""]); // en lista för flera nummer
  const [message, setMessage] = useState("");

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

    const payload = {
      firstName,
      lastName,
      email,
      phonenumber: phoneNumbers.filter(p => p.trim() !== "")
    };

    try {
      const res = await fetch("https://localhost:7253/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email })
      })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error("Fetch error:", err));

      setMessage("Participant created!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumbers([""]);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="createParticipantPage">
      <div className="createParticipant-container">
        <h1 className="createParticipant-title">Creat Participant</h1>
        {message && <p className="success-message">{message}</p>}

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

          <div className="form-group">
            <label htmlFor="phoneNumbers">Phonenumber:</label>
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

          <button type="submit" className="form-button">
            Create Participant
          </button>
        </form>
      </div>
    </div>
  );
}