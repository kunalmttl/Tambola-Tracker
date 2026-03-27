import { createWorker } from 'tesseract.js';

/**
 * Preprocesses an image for better OCR accuracy:
 * - Scales up small images
 * - Converts to grayscale
 * - Boosts contrast (1.8×)
 * - Applies binary threshold
 * Returns a PNG data URL.
 */
function preprocessImage(imageSource) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.max(1, Math.ceil(1400 / Math.max(img.width, img.height)));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;

      for (let i = 0; i < d.length; i += 4) {
        const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        const val = Math.max(0, Math.min(255, ((gray - 128) * 1.8) + 128));
        const bw = val > 140 ? 255 : 0;
        d[i] = d[i+1] = d[i+2] = bw;
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
      if (imageSource instanceof File || imageSource instanceof Blob) {
        URL.revokeObjectURL(img.src);
      }
    };
    img.onerror = () => {
      if (imageSource instanceof File || imageSource instanceof Blob) {
        URL.revokeObjectURL(img.src);
      }
      reject(new Error('Failed to load image for preprocessing'));
    };

    if (imageSource instanceof File || imageSource instanceof Blob) {
      img.src = URL.createObjectURL(imageSource);
    } else {
      img.src = imageSource;
    }
  });
}

/**
 * Robustly splits a string of digits into exactly 5 unique Tambola numbers.
 * Handles cases where Tesseract merges numbers (e.g. "222425" -> [2, 22, 42] etc).
 * Uses backtracking to find a valid 5-number combination.
 */
function splitIntoFiveNumbers(digitStr) {
  const digits = digitStr.replace(/\s/g, '').split('');
  if (digits.length < 5) return null;

  const result = [];

  function backtrack(index, currentNumbers) {
    if (currentNumbers.length === 5) {
      if (index === digits.length) return true;
      // If we have leftovers, checking if they are just noise (like "1" or "7" often read from grid lines)
      const leftovers = digits.slice(index).join('');
      if (/^[174|]+$/.test(leftovers)) return true;
      return false;
    }
    if (index >= digits.length) return false;

    // Try 1-digit number
    const n1 = parseInt(digits[index], 10);
    if (n1 > 0) {
      currentNumbers.push(n1);
      if (backtrack(index + 1, currentNumbers)) return true;
      currentNumbers.pop();
    } else if (n1 === 0) {
      // 0 can only be part of a 2-digit number (10, 20, etc)
    }

    // Try 2-digit number
    if (index + 1 < digits.length) {
      const n2 = parseInt(digits[index] + digits[index + 1], 10);
      if (n2 >= 10 && n2 <= 90) {
        currentNumbers.push(n2);
        if (backtrack(index + 2, currentNumbers)) return true;
        currentNumbers.pop();
      }
    }

    // Special case for noise: if the current digit is a '1', '7', or '4' (likely a grid line)
    // and we haven't found 5 numbers yet, try skipping it.
    if (['1', '7', '4'].includes(digits[index]) && currentNumbers.length < 5) {
      if (backtrack(index + 1, currentNumbers)) return true;
    }

    return false;
  }

  if (backtrack(0, result)) {
    // Return unique numbers only
    const unique = [...new Set(result)];
    return unique.length === 5 ? unique : null;
  }
  return null;
}

/**
 * Main OCR entry point. 
 * Processes the image and extracts 15 numbers into a 3x9 grid.
 */
export async function parseTicketFromImage(imageSource) {
  const processedImage = await preprocessImage(imageSource);
  
  const worker = await createWorker('eng');
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789',
    tessedit_pageseg_mode: '11', // Sparse text
  });

  const { data } = await worker.recognize(processedImage);
  await worker.terminate();

  const lines = data.lines || [];
  const numbersByRow = [];

  // Group text into rows based on vertical position
  // We expect 3 distinct rows.
  lines.forEach(line => {
    const text = line.text.trim();
    if (text.length >= 1) {
      numbersByRow.push({
        y: line.bbox.y0,
        text: text
      });
    }
  });

  // Sort by Y and cluster into 3 rows
  numbersByRow.sort((a, b) => a.y - b.y);
  
  const rows = [];
  if (numbersByRow.length > 0) {
    let currentCluster = [numbersByRow[0]];
    for (let i = 1; i < numbersByRow.length; i++) {
      if (Math.abs(numbersByRow[i].y - currentCluster[0].y) < 50) {
        currentCluster.push(numbersByRow[i]);
      } else {
        rows.push(currentCluster.map(c => c.text).join(''));
        currentCluster = [numbersByRow[i]];
      }
    }
    rows.push(currentCluster.map(c => c.text).join(''));
  }

  const finalGrid = Array(3).fill().map(() => Array(9).fill(''));
  let totalFound = 0;

  // Process exactly 3 rows if possible
  const targetRows = rows.length > 3 ? rows.slice(0, 3) : rows;

  targetRows.forEach((rowStr, rowIndex) => {
    if (rowIndex >= 3) return;
    const rowNumbers = splitIntoFiveNumbers(rowStr);
    if (rowNumbers) {
      rowNumbers.forEach(num => {
        const colIndex = Math.min(8, Math.floor(num / 10) - (num % 10 === 0 ? 1 : 0));
        if (finalGrid[rowIndex][colIndex] === '') {
          finalGrid[rowIndex][colIndex] = num.toString();
          totalFound++;
        }
      });
    }
  });

  return {
    numbersFound: totalFound,
    grid: finalGrid
  };
}
