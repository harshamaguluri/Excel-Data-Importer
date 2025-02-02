interface ColumnConfig {
  excelColumn: string; // Expected header name in Excel
  dbField: string;     // Field name to be stored in the database
  required: boolean;
  type: 'string' | 'number' | 'date';
  validate?: (value: any) => string | null; // Returns error message if invalid, else null
}

interface SheetValidationConfig {
  sheetName: string; // Can be used to create custom configurations for specific sheets
  columns: ColumnConfig[];
}

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

const defaultValidation: SheetValidationConfig = {
  sheetName: 'default',
  columns: [
    {
      excelColumn: 'Name',
      dbField: 'Name',
      required: true,
      type: 'string',
      validate: (value: any) => {
        if (!value || value.toString().trim() === '') return 'Name is required.';
        return null;
      }
    },
    {
      excelColumn: 'Amount',
      dbField: 'Amount',
      required: true,
      type: 'number',
      validate: (value: any) => {
        if (value == null || value === '') return 'Amount is required.';
        const num = Number(value);
        if (isNaN(num)) return 'Amount must be numeric.';
        if (num <= 0) return 'Amount must be greater than zero.';
        return null;
      }
    },
    {
      excelColumn: 'Date',
      dbField: 'Date',
      required: true,
      type: 'date',
      validate: (value: any) => {
        if (!value) return 'Date is required.';
        const date = new Date(value);
        if (isNaN(date.getTime())) return 'Invalid date.';
        if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear) {
          return 'Date must fall within the current month.';
        }
        return null;
      }
    },
    {
      excelColumn: 'Verified',
      dbField: 'Verified',
      required: true,
      type: 'string',
      validate: (value: any) => {
        if (!value || value.toString().trim() === '') return 'Verified is required.';
        const str = value.toString().trim().toLowerCase();
        if (str !== 'yes' && str !== 'no') return 'Verified must be "Yes" or "No".';
        return null;
      }
    }
  ]
};

const validationConfigs: { [sheetName: string]: SheetValidationConfig } = {
  default: defaultValidation
};

export { ColumnConfig, SheetValidationConfig, validationConfigs };
