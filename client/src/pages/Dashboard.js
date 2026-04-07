import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import {
  getCurrentWeek,
  getCurrentMonth,
  getCurrentYear,
  getWeekLabel,
  getMonthLabel,
} from '../utils/dateUtils';
import './Pages.css';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notes, fetchNotes } = useNotes();
  const [viewMode, setViewMode] = useState('week');

  const currentWeek = getCurrentWeek();
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  useEffect(() => {
    if (viewMode === 'week') {
      fetchNotes({ week: currentWeek, year: currentYear });
    } else if (viewMode === 'month') {
      fetchNotes({ month: currentMonth, year: currentYear });
    } else {
      fetchNotes({});
    }
  }, [viewMode, fetchNotes, currentWeek, currentYear, currentMonth]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>EnglishNote</h1>
        <div className="user-menu">
          <span>Welcome, {user?.username || user?.email}</span>
          <button onClick={handleLogout} className="btn-danger">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <button
            className="btn-success"
            onClick={() => navigate('/notes?action=create')}
          >
            + Create New Note
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate('/notes')}
          >
            View All Notes
          </button>
        </div>

        {/* View Modes */}
        <div className="view-modes">
          <h2>Your Notes</h2>
          <div className="mode-buttons">
            <button
              className={`mode-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              This Week
            </button>
            <button
              className={`mode-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              This Month
            </button>
            <button
              className={`mode-btn ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => setViewMode('all')}
            >
              All Notes
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Notes</h3>
            <p className="stat-value">{notes.length}</p>
          </div>
          <div className="stat-card">
            <h3>
              {viewMode === 'week'
                ? getWeekLabel(currentWeek, currentYear)
                : viewMode === 'month'
                ? getMonthLabel(currentMonth, currentYear)
                : 'All Time'}
            </h3>
            <p className="stat-value">{notes.length}</p>
          </div>
        </div>

        {/* Recent Notes */}
        <div className="recent-notes">
          <h2>
            {viewMode === 'week'
              ? `Notes from ${getWeekLabel(currentWeek, currentYear)}`
              : viewMode === 'month'
              ? `Notes from ${getMonthLabel(currentMonth, currentYear)}`
              : 'Recent Notes'}
          </h2>
          {notes.length > 0 ? (
            <div className="notes-list">
              {notes.slice(0, 5).map(note => (
                <div key={note._id} className="note-item">
                  <h4>{note.title}</h4>
                  <p className="note-date">
                    {new Date(note.date).toLocaleDateString()}
                  </p>
                  <p className="note-preview">{note.content.substring(0, 100)}...</p>
                  <button
                    className="btn-primary"
                    onClick={() => navigate(`/notes?noteId=${note._id}`)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No notes yet. Create your first note!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
