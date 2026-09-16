import Tesseract from 'tesseract.js';

export async function extractTextFromImage(imagePath) {
  const { data } = await Tesseract.recognize(imagePath, 'eng');
  const text = data.text.trim();

  if (!text) {
    throw new Error('No readable text found in image');
  }

  return text;
}