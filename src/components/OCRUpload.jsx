import { useState } from 'react';
import { Camera, ImageUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { parseTicketFromImage } from '../utils/ocr';

export default function OCRUpload({ onParsedGrid }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsProcessing(true);

    try {
      const { numbersFound, grid } = await parseTicketFromImage(file);
      if (numbersFound === 15) {
        toast.success(`OCR parsed 15 numbers successfully!`);
      } else {
        toast.error(`OCR found ${numbersFound} numbers, expected 15. Please verify manually.`, { duration: 5000 });
      }
      onParsedGrid(grid);
    } catch (error) {
      console.error(error);
      toast.error('Failed to parse image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <label className="flex-1 cursor-pointer flex flex-col items-center justify-center p-5 h-40 border-2 border-dashed border-overlay rounded-lg bg-surface hover:border-amber hover:bg-amber/5 transition">
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageSelect} />
          <Camera size={32} className="mb-2 text-text-muted" />
          <span className="text-sm text-text-secondary">Take Photo</span>
        </label>
        <label className="flex-1 cursor-pointer flex flex-col items-center justify-center p-5 h-40 border-2 border-dashed border-overlay rounded-lg bg-surface hover:border-amber hover:bg-amber/5 transition">
          <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
          <ImageUp size={32} className="mb-2 text-text-muted" />
          <span className="text-sm text-text-secondary">Upload File</span>
        </label>
      </div>

      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-6 bg-surface rounded-lg border border-overlay">
          <Loader2 className="animate-spin text-amber mb-2" size={32} />
          <p className="text-sm text-text-secondary">Running OCR...</p>
        </div>
      )}

      {preview && !isProcessing && (
        <div className="rounded-lg overflow-hidden border border-overlay">
          <div className="bg-surface px-3 py-2 border-b border-overlay">
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Image Preview</p>
          </div>
          <img src={preview} alt="Ticket preview" className="max-h-[200px] w-full object-contain bg-base" />
        </div>
      )}
    </div>
  );
}
