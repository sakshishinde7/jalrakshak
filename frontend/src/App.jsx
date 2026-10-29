import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ReportIssue from './pages/ReportIssue'
import ExploreReports from './pages/ExploreReports'
import ReportDetails from './pages/ReportDetails'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import NotFound from './pages/NotFound'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/reports" element={<ExploreReports />} />
          <Route path="/reports/:reportCode" element={<ReportDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
