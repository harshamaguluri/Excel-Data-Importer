import React, { useState, DragEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { SheetData, SheetError } from '../pages/Home';

interface FileUploadProps {
  onUploadSuccess: (sheets: SheetData[], errors: SheetError[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const maxFileSize = 2 * 1024 * 1024; // 2 MB

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check MIME type for .xlsx files
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      alert('Only .xlsx files are allowed.');
      return;
    }
    if (file.size > maxFileSize) {
      alert('File size exceeds 2MB.');
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // The backend response includes sheetData (with valid rows) and errors.
      onUploadSuccess(response.data.sheetData, response.data.errors);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file.');
    }
  };

  return (
    <div>
      <div
        className={`border-dashed border-4 p-6 text-center ${dragActive ? 'border-blue-500' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>Drag and drop your .xlsx file here</p>
        <p>or</p>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
      </div>
      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload File
      </button>
    </div>
  );
};

export default FileUpload;
