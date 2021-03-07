import { GoogleCellContent } from './IGoogleCellContent';

export interface GoogleTableCell {
  startIndex: number;
  endIndex: number;
  content: GoogleCellContent[];
  tableCellStyle: object;
}
