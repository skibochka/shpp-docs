import { GoogleElementTextRun } from './IGoogleElementTextRun';
import { GoogleInlineObjectElement } from './IGoogleInlineObjectElement';
export interface GoogleCellElement {
  startIndex: number;
  endIndex: number;
  textRun: GoogleElementTextRun;
  inlineObjectElement?: GoogleInlineObjectElement;
}
