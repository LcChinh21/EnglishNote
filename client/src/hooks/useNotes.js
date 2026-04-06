import { useState, useCallback } from 'react';
import api from '../services/api';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.week) params.append('week', filters.week);
      if (filters.month) params.append('month', filters.month);
      if (filters.year) params.append('year', filters.year);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(`/notes?${params.toString()}`);
      setNotes(response.data.notes || []);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch notes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (noteData) => {
    try {
      setError(null);
      const response = await api.post('/notes', noteData);
      setNotes([response.data.note, ...notes]);
      return response.data.note;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create note';
      setError(errorMessage);
      throw errorMessage;
    }
  }, [notes]);

  const updateNote = useCallback(async (noteId, noteData) => {
    try {
      setError(null);
      const response = await api.put(`/notes/${noteId}`, noteData);
      setNotes(notes.map(n => (n._id === noteId ? response.data.note : n)));
      return response.data.note;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update note';
      setError(errorMessage);
      throw errorMessage;
    }
  }, [notes]);

  const deleteNote = useCallback(async (noteId) => {
    try {
      setError(null);
      await api.delete(`/notes/${noteId}`);
      setNotes(notes.filter(n => n._id !== noteId));
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete note';
      setError(errorMessage);
      throw errorMessage;
    }
  }, [notes]);

  const searchNotes = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/notes/search?q=${encodeURIComponent(query)}`);
      setNotes(response.data.notes || []);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Search failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
  };
};
