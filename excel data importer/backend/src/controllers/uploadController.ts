import { Request, Response } from 'express';
import ExcelJS from 'exceljs';
import { validationConfigs, SheetValidationConfig } from '../config/validationConfig';
import Data from '../models/DataModel';

// Helper: get validation config for a sheet name or default.
const getValidationConfig = (sheetName: string): SheetValidationConfig => {
  return validationConfigs[sheetName] || validationConfigs['default'];
};

// Handles file upload, reads the Excel file, validates rows, and returns sheet data and errors.
export const handleFileUpload = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const sheetDataArray: { sheetName: string; data: any[] }[] = [];
    const errorArray: { sheetName: string; errors: { row: number; message: string }[] }[] = [];

    workbook.eachSheet((worksheet) => {
      const sheetName = worksheet.name;
      const validationConfig = getValidationConfig(sheetName);
      const headerMap: { [key: string]: number } = {};

      let isHeaderParsed = false;
      const validRows: any[] = [];
      const sheetErrors: { row: number; message: string }[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (!isHeaderParsed) {
          row.eachCell((cell, colNumber) => {
            const headerText = cell.text.trim();
            headerMap[headerText] = colNumber;
          });
          isHeaderParsed = true;
          return; // Skip header row.
        }

        const rowData: any = {};
        let rowHasError = false;

        for (const colConfig of validationConfig.columns) {
          const colIndex = headerMap[colConfig.excelColumn];
          const cell = row.getCell(colIndex);
          let cellValue = cell.value;

          if (colConfig.type === 'date' && !(cellValue instanceof Date)) {
            cellValue = new Date(cell.text);
          }

          if (cellValue === null || cellValue === undefined) {
            cellValue = '';
          }

          if (colConfig.required && (cellValue === '' || cellValue === null)) {
            sheetErrors.push({
              row: rowNumber,
              message: `${colConfig.excelColumn} is required.`
            });
            rowHasError = true;
          } else if (colConfig.validate) {
            const errorMsg = colConfig.validate(cellValue);
            if (errorMsg) {
              sheetErrors.push({
                row: rowNumber,
                message: errorMsg
              });
              rowHasError = true;
            }
          }
          rowData[colConfig.dbField] = cellValue;
        }

        if (!rowHasError) {
          validRows.push(rowData);
        }
      });

      sheetDataArray.push({
        sheetName,
        data: validRows
      });

      if (sheetErrors.length > 0) {
        errorArray.push({
          sheetName,
          errors: sheetErrors
        });
      }
    });

    res.json({
      message: 'File processed successfully.',
      sheetData: sheetDataArray,
      errors: errorArray
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file.' });
  }
};

// Handles data import. Expects JSON body with validRows array.
export const handleDataImport = async (req: Request, res: Response) => {
  const validRows = req.body.validRows;
  if (!Array.isArray(validRows) || validRows.length === 0) {
    return res.status(400).json({ error: 'No valid rows provided for import.' });
  }
  try {
    await Data.insertMany(validRows);
    res.json({ message: 'Data imported successfully.' });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ error: 'Error importing data.' });
  }
};
