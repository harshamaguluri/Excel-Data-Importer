import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import DataTable from '../components/DataTable';
import ErrorModal from '../components/ErrorModal';

export interface SheetData {
  sheetName: string;
  data: any[];
}

export interface ErrorDetail {
  row: number;
  message: string;
}

export interface SheetError {
  sheetName: string;
  errors: ErrorDetail[];
}

const Home: React.FC = () => {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<SheetData | null>(null);
  const [errors, setErrors] = useState<SheetError[]>([]);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Called when the file upload is complete (and validation has run)
  const handleUploadSuccess = (sheetData: SheetData[], errorData: SheetError[]) => {
    setSheets(sheetData);
    if (sheetData.length > 0) {
      setSelectedSheet(sheetData[0]);
    }
    if (errorData.length > 0) {
      setErrors(errorData);
      setShowErrorModal(true);
    }
  };

  const handleSheetChange = (sheetName: string) => {
    const found = sheets.find(sheet => sheet.sheetName === sheetName);
    setSelectedSheet(found || null);
  };

  // When the user clicks "Import Data", combine all valid rows from all sheets
  // and send them to the backend for insertion.
  const handleDataImport = async () => {
    const validRows = sheets.reduce((acc: any[], sheet) => {
      return acc.concat(sheet.data);
    }, []);

    if (validRows.length === 0) {
      alert('No valid rows available for import.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/import', { validRows });
      setSuccessMessage(response.data.message);
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import data.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Excel Data Importer</h1>
      <div className="flex flex-col md:flex-row">
        {/* Left side: Upload, Preview, Import */}
        <div className="md:w-1/2 md:pr-4">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          {sheets.length > 0 && (
            <div className="mt-4">
              <label className="mr-2 font-semibold">Select Sheet:</label>
              <select
                onChange={(e) => handleSheetChange(e.target.value)}
                className="border p-1"
              >
                {sheets.map((sheet) => (
                  <option key={sheet.sheetName} value={sheet.sheetName}>
                    {sheet.sheetName}
                  </option>
                ))}
              </select>
              {selectedSheet && <DataTable sheetData={selectedSheet.data} />}
              <button
                onClick={handleDataImport}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              >
                Import Data
              </button>
            </div>
          )}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-200 text-green-800 rounded">
              {successMessage}
            </div>
          )}
        </div>
        {/* Right side: Image */}
        <div className="md:w-1/2 md:pl-4 flex items-center justify-center mt-4 md:mt-0">
          <img src="/img1.jpg" alt="Display" className="max-w-full h-auto" />
        </div>
      </div>
      {showErrorModal && (
        <ErrorModal errors={errors} onClose={() => setShowErrorModal(false)} />
      )}
    </div>
  );
};

export default Home;

// const Home: React.FC = () => {
//   return (
//     <div style={{ background: 'white', color: 'black', minHeight: '100vh', padding: '20px' }}>
//       <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'red' }}>
//         Excel Data Importer
//       </h1>
//       <p>This is the Home page.</p>
//     </div>
//   );
// };

// export default Home;

