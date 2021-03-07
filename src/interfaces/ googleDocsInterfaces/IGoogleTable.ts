import { GoogleTableRow } from './IGoogleTableRow';
export interface GoogleTable {
  rows: number;
  columns: number;
  tableRows: GoogleTableRow[];
  tableStyle: object;
}
