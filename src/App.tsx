import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import { Dashboard } from './pages/Dashboard';
import { AddJobPage } from './pages/AddJobPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <JobProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddJobPage />} />
          <Route path="/job/:id" element={<JobDetailsPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Router>
    </JobProvider>
  );
}

export default App;
