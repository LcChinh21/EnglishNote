import React, { useState } from 'react';
import { performOCR } from '../services/ocrService';
import './OCRUploader.css';

function OCRUploader({ onExtract }) {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setImage(file);
      setError(null);
      setResult(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOCR = async () => {
    if (!image) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ocrResult = await performOCR(image);
      setResult(ocrResult);
    } catch (err) {
      setError(err.message || 'OCR processing failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUseText = () => {
    if (result) {
      onExtract(result.text);
    }
  };

  const handleClear = () => {
    setImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="ocr-uploader">
      {error && <div className="error">{error}</div>}

      <div className="upload-area">
        <label htmlFor="image-input" className="upload-label">
          <div className="upload-icon">📷</div>
          <p>Click to select or drag and drop an image</p>
          <small>Supported formats: JPG, PNG, GIF, WebP</small>
        </label>
        <input
          id="image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
        />
      </div>

      {imagePreview && (
        <div className="preview-area">
          <h4>Image Preview</h4>
          <img src={imagePreview} alt="Preview" className="preview-image" />

          <div className="preview-actions">
            <button
              className="btn-success"
              onClick={handleOCR}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span> Processing...
                </>
              ) : (
                '🔍 Extract Text'
              )}
            </button>
            <button className="btn-secondary" onClick={handleClear}>
              ✕ Clear
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="result-area">
          <h4>Extracted Text</h4>
          <div className="confidence-info">
            <p>Confidence Score: <strong>{result.confidence.toFixed(1)}%</strong></p>
          </div>
          <textarea
            className="result-text"
            value={result.text}
            readOnly
            rows="6"
          />
          <div className="result-actions">
            <button
              className="btn-success"
              onClick={handleUseText}
            >
              ✓ Use This Text
            </button>
            <button className="btn-secondary" onClick={handleClear}>
              ← Try Another Image
            </button>
          </div>
        </div>
      )}

      {!imagePreview && !result && (
        <div className="info-box">
          <h4>How to use OCR:</h4>
          <ol>
            <li>Select or drag an image of your handwritten notes</li>
            <li>Click "Extract Text" to process the image</li>
            <li>Review the extracted text and confidence score</li>
            <li>Click "Use This Text" to add it to your note</li>
          </ol>
          <p><strong>Note:</strong> For best results, ensure good lighting and clear handwriting in the image.</p>
        </div>
      )}
    </div>
  );
}

export default OCRUploader;
