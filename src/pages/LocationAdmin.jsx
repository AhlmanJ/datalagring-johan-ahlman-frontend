import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageLocations() {
  const [locations, setLocations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // fetch all locations from backend when component mounts to display them
  useEffect(() => {
    fetch("https://localhost:7253/api/courses/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => {
        console.error("Error fetching locations:", err);
        setErrorMessage("Error loading locations. Please try again.");
      });
  }, []);

  const handleDelete = async (locationName) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        const response = await fetch(`https://localhost:7253/api/courses/locations/${locationName}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Error deleting location");
        }

        // Delete was successful, update the locations state to remove the deleted location
        setLocations(locations.filter((loc) => loc.name !== locationName));
        setErrorMessage(""); // Clear any error messages
      } catch (error) {
        console.error("Error during location deletion:", error);
        setErrorMessage("Error deleting location, please try again.");
      }
    }
  };

  return (
    <div className="manageLocationsPage">
      <div className="createCourse-container">
        <h1>Manage Locations</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="location-list">
          {locations.length === 0 ? (
            <p>No locations available.</p>
          ) : (
            locations.map((location) => (
              <div key={location.id} className="location-tile">
                <p>{location.name}</p>
                <button
                  className="delete-location-btn"
                  onClick={() => handleDelete(location.name)}
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
