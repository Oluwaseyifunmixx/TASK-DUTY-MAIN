
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import MyTask from './pages/MyTask'
import NewTask from './pages/NewTask'
import EditTask from './pages/EditTask'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './pages/Profile'


function App() {

  return (
   <BrowserRouter>
      <Navbar/>
      <Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/tasks" element={
    <ProtectedRoute>
      <MyTask />
    </ProtectedRoute>
  } />
  <Route path="/tasks/new" element={
    <ProtectedRoute>
      <NewTask />
    </ProtectedRoute>
  } />
  <Route path="/tasks/edit/:id" element={
    <ProtectedRoute>
      <EditTask />
    </ProtectedRoute>
  } />
  <Route path="/profile" element={
  <ProtectedRoute>
   <Profile/>
  </ProtectedRoute>
} />
</Routes>
   </BrowserRouter>
  )
}

export default App
