import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import NoteEditor from '../components/NoteEditor';
import NoteList from '../components/NoteList/NoteList';
import {
  getCurrentWeek,
  getCurrentMonth,
  getCurrentYear,
  getWeekLabel,
  getMonthLabel,
} from '../utils/dateUtils';
import './Pages.css';

function NotesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const { notes, fetchNotes, searchNotes, createNote, updateNote, deleteNote, error } = useNotes();
  const [filter, setFilter] = useState('week');
  const [selectedNote, setSelectedNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentWeek = getCurrentWeek();
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  // Load notes on filter change
  useEffect(() => {
    if (filter === 'week') {
      fetchNotes({ week: currentWeek, year: currentYear });
    } else if (filter === 'month') {
      fetchNotes({ month: currentMonth, year: currentYear });
    } else {
      fetchNotes({});
    }
  }, [filter, fetchNotes, currentWeek, currentYear, currentMonth]);

  // Check if we're creating a new note
  useEffect(() => {
    const noteId = searchParams.get('noteId');
    const action = searchParams.get('action');

    if (action === 'create') {
      setShowEditor(true);
      setSelectedNote(null);
    } else if (noteId) {
      const note = notes.find(n => n._id === noteId);
      if (note) {
        setSelectedNote(note);
      }
    }
  }, [searchParams, notes]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchNotes(query);
    } else {
      // Reset to current filter
      if (filter === 'week') {
        fetchNotes({ week: currentWeek, year: currentYear });
      } else if (filter === 'month') {
        fetchNotes({ month: currentMonth, year: currentYear });
      } else {
        fetchNotes({});
      }
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      await createNote(noteData);
      setShowEditor(false);
      setSelectedNote(null);
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  const handleUpdateNote = async (noteId, noteData) => {
    try {
      await updateNote(noteId, noteData);
      setSelectedNote(null);
    } catch (err) {
      console.error('Error updating note:', err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId);
        setSelectedNote(null);
      } catch (err) {
        console.error('Error deleting note:', err);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <h1>EnglishNote - Notes</h1>
        <div className="user-menu">
          <span>Welcome, {user?.username || user?.email}</span>
          <button onClick={handleLogout} className="btn-danger">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="notes-page">
        {/* Sidebar */}
        <div className="notes-sidebar">
          <h3>Filter Notes</h3>

          <div className="sidebar-section">
            <div
              className={`sidebar-item ${filter === 'week' ? 'active' : ''}`}
              onClick={() => setFilter('week')}
            >
              📅 This Week
            </div>
            <div
              className={`sidebar-item ${filter === 'month' ? 'active' : ''}`}
              onClick={() => setFilter('month')}
            >
              📆 This Month
            </div>
            <div
              className={`sidebar-item ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              📚 All Notes
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Actions</h3>
            <button
              className="btn-success"
              style={{ width: '100%', marginBottom: '10px' }}
              onClick={() => {
                setShowEditor(true);
                setSelectedNote(null);
              }}
            >
              + New Note
            </button>
            <button
              className="btn-secondary"
              style={{ width: '100%' }}
              onClick={() => navigate('/dashboard')}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="notes-main">
          {/* Header with Search */}
          <div className="notes-header">
            <h2>
              {filter === 'week'
                ? getWeekLabel(currentWeek, currentYear)
                : filter === 'month'
                ? getMonthLabel(currentMonth, currentYear)
                : 'All Notes'}
            </h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          {/* Notes Display or Editor */}
          {showEditor ? (
            <NoteEditor
              note={selectedNote}
              onSave={selectedNote ? handleUpdateNote : handleCreateNote}
              onCancel={() => {
                setShowEditor(false);
                setSelectedNote(null);
              }}
            />
          ) : selectedNote ? (
            <div className="note-detail">
              <NoteList
                notes={[selectedNote]}
                onEdit={(note) => {
                  setSelectedNote(note);
                  setShowEditor(true);
                }}
                onDelete={handleDeleteNote}
              />
              <button
                className="btn-secondary"
                onClick={() => setSelectedNote(null)}
                style={{ marginTop: '20px' }}
              >
                Back to List
              </button>
            </div>
          ) : (
            <div className="notes-container">
              {notes.length > 0 ? (
                <NoteList
                  notes={notes}
                  onEdit={(note) => {
                    setSelectedNote(note);
                    setShowEditor(true);
                  }}
                  onDelete={handleDeleteNote}
                  onSelectNote={setSelectedNote}
                />
              ) : (
                <div className="empty-notes">
                  <p>No notes found.</p>
                  <p>Start by creating a new note or upload images with OCR!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotesPage;
