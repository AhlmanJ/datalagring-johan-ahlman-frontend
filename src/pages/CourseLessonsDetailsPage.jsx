import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LessonsPage() {
  const { courseId } = useParams(); // Get course-ID from the URL-parameter
  const [lessons, setLessons] = useState([]);
  const [participants, setParticipants] = useState([]); // New state for participants
  const [selectedLesson, setSelectedLesson] = useState(null); // Track selected lesson
  const [selectedParticipant, setSelectedParticipant] = useState(null); // Track selected participant
  const [loading, setLoading] = useState(true);

  // Simple date format function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // You can customize the format here
  };

  useEffect(() => {
    // Fetch lessons
    console.log("Course ID:", courseId);

    if (!courseId) {
      console.error("Course ID is undefined");
      return;
    }

    fetch(`https://localhost:7253/api/courses/${courseId}/lessons`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Lessons data:", data);
        setLessons(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });

    // Fetch participants
    fetch("https://localhost:7253/api/participants") // API endpoint for participants
      .then((res) => res.json())
      .then((data) => {
        setParticipants(data);
        console.log("Participants data:", data); // Debug: check what participants data looks like
      })
      .catch((err) => console.error("Error fetching participants:", err));

  }, [courseId]);

  const handleBooking = () => {
    console.log("Booking button clicked"); // Debugging log
    // Check if both a lesson and a participant are selected before attempting to book
    if (selectedLesson && selectedParticipant) {
      // Debugging logs to verify selected lesson and participant
      console.log("Selected Lesson ID:", selectedLesson.id); // this should be the lesson's ID
      console.log("Selected Participant ID:", selectedParticipant.participantId); // this should be the participant's ID

      // Convert IDs to uppercase (if necessary)
      const participantId = selectedParticipant.participantId.toUpperCase();
      const lessonId = selectedLesson.id.toUpperCase();

      // Prepare the booking data
      const bookingData = {
        participantId: participantId,
        lessonsId: lessonId
      };

      // Construct the URL for the booking endpoint
      const bookingUrl = `https://localhost:7253/api/enrollments?participantId=${participantId}&lessonsId=${lessonId}`;
      // Debugging: Check the booking data and URL
      console.log("Booking Data:", bookingData);
      console.log("Booking URL:", bookingUrl);

      // Send POST request to the API with the booking data
      fetch(bookingUrl, {
        method: "POST",  // POST since we are sending data to create a new resource
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),  // Send the booking data as JSON
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Booking successful:", data);
          alert("Booking successful!");
        })
        .catch((err) => {
          console.error("Booking failed:", err);
          alert("Something went wrong while booking the lesson.");
        });
    } else {
      // If either lesson or participant is not selected, show an error message
      console.error("Please select both a lesson and a participant.");
      alert("Please select both a lesson and a participant.");
    }
  };

  if (loading) {
    return <p>Loading lessons...</p>;
  }

  return (
    <div className="lessonsPage">
      <h1>Lessons for Course: <div className="course-id">{courseId}</div></h1>
      <div>
        {lessons.length === 0 ? (
          <p>No lessons found for this course.</p>
        ) : (
          <div className="lessonsTiles-wrapper">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="lesson-tile"
                onClick={() => {
                  setSelectedLesson(lesson); // capture the entire lesson object when a lesson is clicked
                  console.log("Selected Lesson:", lesson); // debugging: check what the selected lesson object looks like when clicked
                }}
              >
                <h3>{lesson.name}</h3>
                <p>{formatDate(lesson.startDate)} - {formatDate(lesson.endDate)}</p>
                <p>Kapacitet: {lesson.maxCapacity}</p>
                <p>Platser lediga: {lesson.maxCapacity - lesson.enrolled}</p>
                <p>Kursnamn: {lesson.courseName}</p>
                <p>Plats: {lesson.location}</p>
              </div>
            ))}
          </div>
        )}

        {selectedLesson && (
          <div className="booking-section">
            <h2>Book participant for: {selectedLesson.name}</h2>
            <label htmlFor="participants">Select participant:</label>
            <select
              id="participants"
              onChange={(e) => {
                const selectedId = e.target.value; // ID from dropdown-choice
                console.log("Selected Participant ID:", selectedId); // Debugging: check selected participant ID from dropdown
                const participant = participants.find((p) => p.participantId === selectedId); // Find the participant object based on the selected ID
                setSelectedParticipant(participant);
                console.log("Selected Participant:", participant); // Debugging: Check the selected participant object after finding it in the participants array
              }}
            >
              <option value="">Select participant</option>
              {participants.map((participant) => (
                <option key={participant.participantId} value={participant.participantId}>
                  {participant.firstName} {participant.lastName} {/* Show first and last name */}
                </option>
              ))}
            </select>
            <button onClick={handleBooking}>Book participant</button>
          </div>
        )}
      </div>
    </div>
  );
}
