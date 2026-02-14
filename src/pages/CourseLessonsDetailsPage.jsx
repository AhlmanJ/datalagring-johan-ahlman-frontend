import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LessonsPage() {
  const { courseId } = useParams(); // Get course-ID from the URL-parameter
  const [lessons, setLessons] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [enrollments, setEnrollments] = useState([]);  // To store enrollments data
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simple date format function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // You can customize the format here
  };

  // Fetch lessons, participants, and enrollments when the page loads
  useEffect(() => {
    console.log("Course ID:", courseId);

    if (!courseId) {
      console.error("Course ID is undefined");
      return;
    }

    // Fetch lessons
    fetch(`https://localhost:7253/api/courses/${courseId}/lessons`)
      .then((res) => res.json())
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
    fetch("https://localhost:7253/api/participants")
      .then((res) => res.json())
      .then((data) => {
        setParticipants(data);
        console.log("Participants data:", data);
      })
      .catch((err) => console.error("Error fetching participants:", err));

    // Fetch all enrollments to associate with participants and load from localStorage
    const savedEnrollments = JSON.parse(localStorage.getItem("enrollments")) || [];
    setEnrollments(savedEnrollments);
    console.log("Enrollments data from localStorage:", savedEnrollments);

  }, [courseId]); // The effect runs every time the courseId changes

  // Handle booking a participant to a lesson
  const handleBooking = () => {
    console.log("Booking button clicked");
    if (selectedLesson && selectedParticipant) {
      console.log("Selected Lesson ID:", selectedLesson.id);
      console.log("Selected Participant ID:", selectedParticipant.participantId);

      const participantId = selectedParticipant.participantId.toUpperCase();
      const lessonId = selectedLesson.id.toUpperCase();

      const bookingData = {
        participantId: participantId,
        lessonsId: lessonId
      };

      const bookingUrl = `https://localhost:7253/api/enrollments?participantId=${participantId}&lessonsId=${lessonId}`;

      fetch(bookingUrl, {
        method: "POST", // Use POST since we are creating a new resource
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Booking successful:", data);

          // Update enrollments after booking
          const newEnrollment = { 
            participantId: selectedParticipant.participantId, 
            lessonName: selectedLesson.name, 
            enrollmentId: data.enrollmentId 
          };

          // Update enrollments state
          setEnrollments((prevEnrollments) => [...prevEnrollments, newEnrollment]);

          // Save the updated enrollments to localStorage
          const updatedEnrollments = [...enrollments, newEnrollment];
          localStorage.setItem("enrollments", JSON.stringify(updatedEnrollments));

          alert("Booking successful!");
        })
        .catch((err) => {
          console.error("Booking failed:", err);
          alert("Something went wrong while booking the lesson.");
        });
    } else {
      alert("Please select both a lesson and a participant.");
    }
  };

  // Handle deleting a participant's enrollment
  const handleDeleteBooking = () => {
    if (selectedLesson && selectedParticipant) {
      const participantId = selectedParticipant.participantId.toUpperCase();
      const lessonName = selectedLesson.name; // lessonName is now lesson's name

      // Step 1: Find the enrollmentId that matches the lessonName
      const enrollment = enrollments.find(
        (e) => e.lessonName === lessonName && e.participantId === selectedParticipant.participantId
      );

      if (enrollment) {
        const enrollmentId = enrollment.enrollmentId;

        // Step 2: Send DELETE request with the enrollmentId
        const deleteUrl = `https://localhost:7253/api/enrollments/${enrollmentId}/${lessonName}/${participantId}`;
        fetch(deleteUrl, {
          method: "DELETE", // DELETE method to remove the booking
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }

            // Remove the enrollment from localStorage
            const savedEnrollments = JSON.parse(localStorage.getItem("enrollments")) || [];
            const updatedEnrollments = savedEnrollments.filter(
              (e) => e.enrollmentId !== enrollmentId
            );
            
            // If there are no enrollments left, remove the whole key from localStorage
            if (updatedEnrollments.length === 0) {
              localStorage.removeItem("enrollments");
            } else {
              localStorage.setItem("enrollments", JSON.stringify(updatedEnrollments));
            }

            // Remove the enrollment from state as well
            setEnrollments(updatedEnrollments);

            alert("Booking has been successfully removed!");
          })
          .catch((err) => {
            console.error("Delete failed:", err);
            alert("Something went wrong while deleting the booking.");
          });
      } else {
        alert("Enrollment not found for the selected lesson.");
      }
    } else {
      alert("Please select both a lesson and a participant to delete.");
    }
  };

  // Add enrolled lesson name to each participant in dropdown
  const getEnrolledLessonName = (participantId) => {
    const enrollment = enrollments.find(
      (e) => e.participantId === participantId
    );
    return enrollment ? enrollment.lessonName : "Not enrolled"; // Return "Not enrolled" if no lesson found
  };

  if (loading) {
    return <p>Loading lessons...</p>;
  }
  
  return (
    <div className="lessonsPage">
      <h1>Lessons for Course: <div className="course-id">{courseId}</div></h1>
      <h1>Click on a lesson to book or delete a booking</h1>
      <div>
        {lessons.length === 0 ? (
          <p className="no-lessons-message">No lessons found for this course.</p>
        ) : (
          <div className="lessonsTiles-wrapper">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="lesson-tile"
                onClick={() => {
                  setSelectedLesson(lesson);
                  console.log("Selected Lesson:", lesson);
                }}
              >
                <h3>{lesson.name}</h3>
                <p>{formatDate(lesson.startDate)} - {formatDate(lesson.endDate)}</p>
                <p>Capacity: {lesson.maxCapacity}</p>
                <p>Available spaces: {lesson.maxCapacity - lesson.enrolled}</p>
                <p>Course name: {lesson.courseName}</p>
                <p>Location: {lesson.location}</p>
                <p>Instructor: {lesson.instructors}</p>
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
                const selectedId = e.target.value;
                console.log("Selected Participant ID:", selectedId);
                const participant = participants.find((p) => p.participantId === selectedId);
                setSelectedParticipant(participant);
                console.log("Selected Participant:", participant);
              }}
            >
              <option value="">Select participant</option>
              {participants.map((participant) => (
                <option key={participant.participantId} value={participant.participantId}>
                  {participant.firstName} {participant.lastName} 
                  {` - ${getEnrolledLessonName(participant.participantId)}`}  {/* Show lesson name if enrolled */}
                </option>
              ))}
            </select>
            <button onClick={handleBooking}>Book participant</button>
            <button onClick={handleDeleteBooking}>Delete booking</button>
          </div>
        )}
      </div>
    </div>
  ); 
}