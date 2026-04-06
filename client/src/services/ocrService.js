import { createWorker } from 'tesseract.js';

let worker = null;

// Initialize OCR worker
export const initializeOCRWorker = async () => {
  if (!worker) {
    worker = await createWorker('eng');
  }
  return worker;
};

// Perform OCR on image file
export const performOCR = async (imageFile) => {
  try {
    const w = await initializeOCRWorker();
    
    // Create FileReader to convert File to readable format
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const result = await w.recognize(e.target.result);
          resolve({
            text: result.data.text,
            confidence: result.data.confidence,
          });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsArrayBuffer(imageFile);
    });
  } catch (error) {
    throw new Error('OCR processing failed: ' + error.message);
  }
};

// Terminate OCR worker (call before page unload)
export const terminateOCRWorker = async () => {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
};
