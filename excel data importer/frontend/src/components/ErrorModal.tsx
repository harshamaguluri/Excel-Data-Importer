import React, { useState } from 'react';
import { SheetError } from '../pages/Home';

interface ErrorModalProps {
  errors: SheetError[];
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ errors, onClose }) => {
  const [activeTab, setActiveTab] = useState(errors[0].sheetName);
  const activeErrors = errors.find(e => e.sheetName === activeTab)?.errors || [];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-2/3">
        <h2 className="text-xl font-bold mb-4">Validation Errors</h2>
        <div className="mb-4 border-b">
          {errors.map((err) => (
            <button
              key={err.sheetName}
              className={`mr-2 px-3 py-1 ${activeTab === err.sheetName ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab(err.sheetName)}
            >
              {err.sheetName}
            </button>
          ))}
        </div>
        <div className="max-h-64 overflow-y-auto">
          {activeErrors.length > 0 ? (
            <ul>
              {activeErrors.map((error, index) => (
                <li key={index} className="mb-2">
                  <strong>Row {error.row}:</strong> {error.message}
                </li>
              ))}
            </ul>
          ) : (
            <p>No errors for this sheet.</p>
          )}
        </div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
