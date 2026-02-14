import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HomePage from './pages/HomePage'
import CourseLessonsDetailsPage from './pages/CourseLessonsDetailsPage'
import InstructorAdmin from './pages/InstructorAdminPage'
import ParticipantAdmin from './pages/ParticipantAdminPage'
import CourseAdmin from './pages/CourseAdminPage'
import LocationAdmin from './pages/LocationAdmin'
import LessonAdmin from './pages/LessonAdminPage'
import EnrollmentsPage from './pages/EnrollmentsPage'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/sections/header'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses/:courseId/lessons" element={<CourseLessonsDetailsPage />} />
        <Route path="/create-instructor" element={<InstructorAdmin />} />
        <Route path="/create-participant" element={<ParticipantAdmin />} />
        <Route path="/create-course" element={<CourseAdmin />} />
        <Route path="/create-lesson" element={<LessonAdmin />} />
        <Route path="/manage-locations" element={<LocationAdmin />} />
        <Route path="/enrollments" element={<EnrollmentsPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
