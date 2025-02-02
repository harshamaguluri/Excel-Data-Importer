import React, { useState } from 'react';

interface DataTableProps {
  sheetData: any[];
}

const ITEMS_PER_PAGE = 10;

const formatDate = (date: any) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatIndianNumber = (num: any) => {
  if (isNaN(num)) return num;
  return Number(num).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const DataTable: React.FC<DataTableProps> = ({ sheetData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(sheetData);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this row?')) {
      const absoluteIndex = indexOfFirstItem + index;
      const newData = [...data];
      newData.splice(absoluteIndex, 1);
      setData(newData);
    }
  };

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <th key={key} className="border px-4 py-2">{key}</th>
              ))
            }
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-100">
              {Object.entries(row).map(([key, value], index) => (
                <td key={index} className="border px-4 py-2">
                  {key.toLowerCase().includes('date')
                    ? formatDate(value)
                    : key.toLowerCase().includes('amount')
                      ? formatIndianNumber(value)
                      : value}
                </td>
              ))}
              <td className="border px-4 py-2">
                <button onClick={() => handleDelete(idx)} className="text-red-500">
                  &#128465;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
