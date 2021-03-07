import { GoogleTableCell } from './IGoogleTableCell';

export interface GoogleTableRow {
  startIndex: number;
  endIndex: number;
  tableCells: GoogleTableCell[];
  tableRowStyle: object;
}
