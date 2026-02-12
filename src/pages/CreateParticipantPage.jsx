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


      setMessage("Deltagare skapad!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumbers([""]);
    } catch (err) {
      setMessage(`Fel: ${err.message}`);
    }
  };

  return (
    <div>
      <h1>Skapa deltagare</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Förnamn:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Efternamn:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Telefonnummer:</label>
          {phoneNumbers.map((phone, index) => (
            <input
              key={index}
              type="text"
              value={phone}
              onChange={(e) => handlePhoneChange(index, e.target.value)}
            />
          ))}
          <button type="button" onClick={addPhoneNumberField}>
            Lägg till nummer
          </button>
        </div>
        <button type="submit">Skapa deltagare</button>
      </form>
    </div>
  );
}