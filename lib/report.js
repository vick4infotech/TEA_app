import * as XLSX from 'xlsx';
import { CHURCH_NAME, APP_NAME } from './constants';
import { createReportPdf } from './simplePdf';

function safe(value) {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export async function tablePdf(title, rows, columns = null) {
  return createReportPdf({ title, churchName: CHURCH_NAME, appName: APP_NAME, rows, columns });
}

export function csvBuffer(rows, columns = null) {
  const keys = columns?.length ? columns : (rows[0] ? Object.keys(rows[0]) : []);
  const escape = value => `"${safe(value).replace(/"/g, '""')}"`;
  const lines = [
    keys.map(escape).join(','),
    ...rows.map(row => keys.map(key => escape(row[key])).join(','))
  ];
  return Buffer.from(lines.join('\r\n'), 'utf8');
}

export function excelBuffer(rows, sheetName = 'Report') {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Information: 'No records available' }]);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}
