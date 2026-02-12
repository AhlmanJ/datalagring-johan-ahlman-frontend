import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HomePage from './pages/HomePage'
import CourseLessonsDetailsPage from './pages/CourseLessonsDetailsPage'
import CreateInstructor from './pages/CreateInstructorPage'
import CreateParticipant from './pages/CreateParticipantPage'
import CreateCourse from './pages/CreateCoursePage'
import CreateLesson from './pages/CreateLessonPage'
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
        <Route path="/create-instructor" element={<CreateInstructor />} />
        <Route path="/create-participant" element={<CreateParticipant />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/create-lesson" element={<CreateLesson />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
