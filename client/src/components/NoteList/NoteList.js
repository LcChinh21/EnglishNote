import React from 'react';
import '../pages/Pages.css';

function NoteList({ notes, onEdit, onDelete, onSelectNote }) {
  return (
    <>
      {notes.map(note => (
        <div key={note._id} className="note-card">
          <div className="note-card-header">
            <h3>{note.title}</h3>
            <span className="note-card-date">
              {new Date(note.date).toLocaleDateString()}
            </span>
          </div>

          <div className="note-card-content">
            {note.content.substring(0, 150)}
            {note.content.length > 150 ? '...' : ''}
          </div>

          {note.tags && note.tags.length > 0 && (
            <div className="note-card-tags">
              {note.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="note-card-actions">
            <button
              className="note-edit-btn"
              onClick={() => onEdit(note)}
            >
              Edit
            </button>
            <button
              className="note-delete-btn"
              onClick={() => onDelete(note._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default NoteList;
