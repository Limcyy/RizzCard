import { Routes, Route, Navigate } from 'react-router-dom'
import CardDisplay from './components/CardDisplay'
import './App.css'

function App() {
  return (
    <div className="main-page-wrapper">
      <Routes>
        {/* Default route redirects to Adam's cards */}
        <Route path="/" element={<Navigate to="/AdamCard" replace />} />
        
        {/* Routes for each person's cards */}
        <Route path="/AdamCard" element={<CardDisplay personName="Adam" />} />
        <Route path="/KrystofCard" element={<CardDisplay personName="Krystof" />} />
        
        {/* Add more routes for other people as needed */}
        
        {/* Catch-all route for unknown paths */}
        <Route path="*" element={<Navigate to="/AdamCard" replace />} />
      </Routes>
    </div>
  )
}

export default App
