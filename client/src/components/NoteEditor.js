import React, { useState, useEffect } from 'react';
import { formatDateForInput } from '../utils/dateUtils';
import OCRUploader from './OCRUploader';
import './NoteEditor.css';

function NoteEditor({ note, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOCR, setShowOCR] = useState(false);

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        date: formatDateForInput(note.date),
        tags: note.tags.join(', '),
      });
    }
  }, [note]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const noteData = {
        title: formData.title,
        content: formData.content,
        date: new Date(formData.date).toISOString(),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      };

      if (note) {
        await onSave(note._id, noteData);
      } else {
        await onSave(noteData);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOCRExtract = (extractedText) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content ? prev.content + '\n\n' + extractedText : extractedText,
    }));
    setShowOCR(false);
  };

  return (
    <div className="note-editor-container">
      <div className="editor-card">
        <h2>{note ? 'Edit Note' : 'Create New Note'}</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter note title"
              className="form-control"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., vocabulary, grammar, phrasal-verbs"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter your note content here..."
              rows="10"
              className="form-control"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowOCR(!showOCR)}
            >
              {showOCR ? '✕ Hide OCR Scanner' : '📸 Scan Handwritten Notes (OCR)'}
            </button>

            <div className="button-group">
              <button
                type="submit"
                disabled={loading}
                className="btn-success"
              >
                {loading ? 'Saving...' : note ? 'Update Note' : 'Create Note'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

        {showOCR && (
          <div className="ocr-section">
            <h3>📸 OCR Scanner</h3>
            <OCRUploader onExtract={handleOCRExtract} />
          </div>
        )}
      </div>
    </div>
  );
}

export default NoteEditor;
