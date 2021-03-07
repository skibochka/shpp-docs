import { Doc } from './interfaces';
import { DocText } from './interfaces';
import { DocTable } from './interfaces';
import { GoogleTable } from './interfaces/ googleDocsInterfaces/IGoogleTable';
import { GoogleTableRow } from './interfaces/ googleDocsInterfaces/IGoogleTableRow';
import { GoogleTableCell } from './interfaces/ googleDocsInterfaces/IGoogleTableCell';
import { GoogleCellContent } from './interfaces/ googleDocsInterfaces/IGoogleCellContent';
import { GoogleCellElement } from './interfaces/ googleDocsInterfaces/IGoogleCellElement';
import MarkdownConverters from './markdownConverters';
import { docs_v1 as GoogleDocsTypes } from 'googleapis';

function buildParagraph(
  content: GoogleCellContent,
  googleDocument: any,
): DocText {
  const text: string[] = content.paragraph.elements.map(
    (element: GoogleCellElement): string => {
      if (element.inlineObjectElement) {
        const { inlineObjectId } = element.inlineObjectElement;
        const inlineObject =
          googleDocument.inlineObjects[inlineObjectId].inlineObjectProperties
            .embeddedObject;

        return MarkdownConverters.createMarkdownImage(
          inlineObject.imageProperties.contentUri,
        );
      }

      let temporaryContentStorage = element.textRun.content;

      if (element.textRun.textStyle.link) {
        temporaryContentStorage = MarkdownConverters.createMarkdownLink(
          element.textRun.textStyle.link.url,
          temporaryContentStorage,
        );
      }

      if (element.textRun.textStyle.bold) {
        temporaryContentStorage = MarkdownConverters.markdownBold(
          temporaryContentStorage,
        );
      }

      if (element.textRun.textStyle.italic) {
        temporaryContentStorage = MarkdownConverters.markdownItalic(
          temporaryContentStorage,
        );
      }
      return temporaryContentStorage;
    },
  );

  return {
    type: 'text',
    text: text.join(''),
  };
}

function buildCell(googleTableCell: GoogleTableCell, googleDocument: any): Doc {
  return {
    document: googleTableCell.content.map((content: GoogleCellContent) => {
      return buildParagraph(content, googleDocument);
    }),
  };
}

function buildRow(googleTableRow: GoogleTableRow, googleDocument: any): Doc[] {
  return googleTableRow.tableCells.map((googleTableCell: GoogleTableCell) =>
    buildCell(googleTableCell, googleDocument),
  );
}

function buildTable(googleTable: GoogleTable, googleDocument: any): DocTable {
  return {
    type: 'table',
    table: googleTable.tableRows.map((googleTableRow: GoogleTableRow) =>
      buildRow(googleTableRow, googleDocument),
    ),
  };
}

export function buildDocument(googleDocument: any): Doc {
  const document: Doc = { document: [] };

  googleDocument.body.content.forEach((content: any) => {
    if (content.paragraph) {
      const text: DocText = buildParagraph(content, googleDocument);
      document.document.push(text);
    }

    if (content.table) {
      const table: DocTable = buildTable(content.table, googleDocument);
      document.document.push(table);
    }
  });
  return document;
}
