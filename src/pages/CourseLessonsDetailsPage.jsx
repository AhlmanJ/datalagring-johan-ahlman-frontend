import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export default function LessonsPage() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  // Helper to extract error messages from backend responses
  const getErrorMessage = async (res) => {
    const contentType = res.headers.get("content-type");
    let data = null;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json().catch(() => null);
    } else {
      data = await res.text().catch(() => null);
    }
    // If the response is a string, try to parse it as JSON to extract more details
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        // Keep it as a string if it can't be parsed
      }
    }
    // Return the most relevant error message
    return data?.detail || data?.message || data?.error || (typeof data === "string" && data) || "Something went wrong.";
  };
  // Helper to handle backend responses
  const handleResponse = async (res) => {
    if (!res.ok) {
      const errorMessage = await getErrorMessage(res);
      throw new Error(errorMessage);
    }
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    } else {
      return res.text();
    }
  };
  // Fetch enrollments from backend
  const fetchEnrollments = () => {
    fetch("https://localhost:7253/api/enrollments")
      .then(handleResponse)
      .then((data) => {
        console.log("Enrollments from backend:", data);
        setEnrollments(data);
      })
      .catch((err) => {
        console.error("Error fetching enrollments:", err);
        alert(err.message);
      });
  };
  useEffect(() => {
    if (!courseId) return;
    // Fetch lessons
    fetch(`https://localhost:7253/api/courses/${courseId}/lessons`)
      .then(handleResponse)
      .then((data) => {
        setLessons(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
        setLoading(false);
      });
    // Fetch participants
    fetch("https://localhost:7253/api/participants")
      .then(handleResponse)
      .then((data) => {
        setParticipants(data);
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
    fetchEnrollments();
  }, [courseId]);
  // BOOK
  const handleBooking = () => {
    if (selectedLesson && selectedParticipant) {
      const participantId = selectedParticipant.participantId.toUpperCase();
      const lessonId = selectedLesson.id.toUpperCase();
      const bookingData = {
        participantId: participantId,
        lessonsId: lessonId
      };
      const bookingUrl =
        `https://localhost:7253/api/enrollments?participantId=${participantId}&lessonsId=${lessonId}`;
      fetch(bookingUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })
        .then(handleResponse)
        .then(() => {
          alert("Booking successful!");
          fetchEnrollments();
        })
        .catch((err) => {
          console.error("Booking failed:", err);
          alert(err.message);
        });
    } else {
      alert("Please select both a lesson and a participant.");
    }
  };
  // DELETE
  const handleDeleteBooking = () => {
    if (selectedLesson && selectedParticipant) {
      const enrollment = enrollments.find(
        (e) =>
          e.lessonName === selectedLesson.name &&
          e.email === selectedParticipant.email
      );
      if (!enrollment) {
        alert("Enrollment not found for the selected lesson.");
        return;
      }
      const deleteUrl =
        `https://localhost:7253/api/enrollments/${enrollment.enrollmentId}/${selectedLesson.name}/${selectedParticipant.participantId}`;
      fetch(deleteUrl, { method: "DELETE" })
        .then(handleResponse)
        .then(() => {
          alert("Booking has been successfully removed!");
          fetchEnrollments();
        })
        .catch((err) => {
          console.error("Delete failed:", err);
          alert(err.message);
        });
    } else {
      alert("Please select both a lesson and a participant to delete.");
    }
  };
  const getEnrolledLessonName = (participantEmail) => {
    const enrollment = enrollments.find(
      (e) => e.email === participantEmail
    );
    return enrollment ? enrollment.lessonName : "Not enrolled";
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
                onClick={() => setSelectedLesson(lesson)}
              >
                <h3>{lesson.name}</h3>
                <p>{formatDate(lesson.startDate)} - {formatDate(lesson.endDate)}</p>
                <p>Capacity: {lesson.maxCapacity}</p>
                <p>Available spaces: {lesson.maxCapacity - lesson.enrolled}</p>
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
                const participant = participants.find(
                  (p) => p.participantId === selectedId
                );
                setSelectedParticipant(participant);
              }}
            >
              <option value="">Select participant</option>
              {participants.map((participant) => (
                <option
                  key={participant.participantId}
                  value={participant.participantId}
                >
                  {participant.firstName} {participant.lastName}
                  {` - ${getEnrolledLessonName(participant.email)}`}
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