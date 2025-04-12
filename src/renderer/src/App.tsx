import { BrowserRouter, Routes, Route } from 'react-router'
import SignIn from './authentication/sign-in'
import Signup from './authentication/sing-up'
import ForgotPassword from './authentication/forgot-password'
import Dashboard from './pages/dashboard'
import Settings from './pages/settings'
import AttendanceProcessingPage from './pages/process_attdendence'
import StudentsClassesPage from './pages/students_classes'
import AddClassPage from './pages/add-class'
import EditClassPage from './pages/edit-class'
import RemoveClassPage from './pages/remove-class'
import ViewClassesPage from './pages/view-class'
import AssignStudentsPage from './pages/assign-students'
import AddRemoveStudentsPage from './pages/edit-assign-students'
import AttendanceRecords from './pages/attendence-records'
import ViewStudents from './pages/view-students'
function App(): JSX.Element {
    // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/process-attendance" element={<AttendanceProcessingPage />} />
                <Route path="/class-info" element={<StudentsClassesPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/settings" element={<Settings />} />

                {/* Class CRUD */}
                <Route path="/add-class" element={<AddClassPage />} />
                <Route path="/edit-class" element={<EditClassPage />} />
                <Route path="/remove-class" element={<RemoveClassPage />} />
                <Route path="/view-class" element={<ViewClassesPage />} />
                <Route path="/assign-students" element={<AssignStudentsPage />} />
                <Route path="/assign-students/edit" element={<AddRemoveStudentsPage />} />
                <Route path="/attendance-records" element={<AttendanceRecords />} />
                <Route path="/view-students" element={<ViewStudents />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
