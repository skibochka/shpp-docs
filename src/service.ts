import { Doc } from './interfaces';
import { DocText } from './interfaces';
import { DocTable } from './interfaces';
import MarkdownConverters from './markdownConverters';
import { docs_v1 as GoogleDocsTypes } from 'googleapis';

function buildParagraph(
  paragraph: GoogleDocsTypes.Schema$Paragraph,
  googleDocument: GoogleDocsTypes.Schema$Document,
): string {
  if (!paragraph.elements) return '';
  const text: string[] = paragraph.elements.map(
    (element: GoogleDocsTypes.Schema$ParagraphElement): string => {
      if (element.inlineObjectElement?.inlineObjectId) {
        const { inlineObjectId } = element.inlineObjectElement;

        if (googleDocument.inlineObjects?.[inlineObjectId]) {
          const inlineObject = googleDocument.inlineObjects[inlineObjectId];
          if (
            inlineObject.inlineObjectProperties?.embeddedObject?.imageProperties
              ?.contentUri
          ) {
            return MarkdownConverters.createMarkdownImage(
              inlineObject.inlineObjectProperties.embeddedObject.imageProperties
                .contentUri,
            );
          }
        }
      }
      if (!element.textRun) return '';

      let temporaryContentStorage = element.textRun.content;

      if (element.textRun.textStyle?.link?.url) {
        temporaryContentStorage = MarkdownConverters.createMarkdownLink(
          element.textRun.textStyle.link.url,
          element.textRun.content,
        );
      }

      if (element.textRun.textStyle?.bold && element.textRun.content) {
        temporaryContentStorage = MarkdownConverters.markdownBold(
          element.textRun.content,
        );
      }

      if (element.textRun.textStyle?.italic && element.textRun.content) {
        temporaryContentStorage = MarkdownConverters.markdownItalic(
          element.textRun.content,
        );
      }
      if (!temporaryContentStorage) return '';

      return temporaryContentStorage;
    },
  );
  return text.join('');
}

function buildContent(
  content: GoogleDocsTypes.Schema$StructuralElement,
  googleDocument: GoogleDocsTypes.Schema$Document,
): DocText | DocTable {
  if (content.paragraph) {
    return {
      type: 'text',
      text: buildParagraph(content.paragraph, googleDocument),
    };
  }
  if (content.table) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return buildTable(content.table, googleDocument);
  }
  return {
    type: 'text',
    text: '',
  };
}

function buildCell(
  googleTableCell: GoogleDocsTypes.Schema$TableCell,
  googleDocument: GoogleDocsTypes.Schema$Document,
): Doc {
  const document: Doc = { document: [] };
  if (googleTableCell.content) {
    const text: string[] = [];
    googleTableCell.content.forEach(
      (content: GoogleDocsTypes.Schema$StructuralElement) => {
        const cellContent = buildContent(content, googleDocument);
        if (cellContent.type === 'text') {
          return text.push(cellContent.text);
        }
        return document.document.push(cellContent);
      },
    );
    document.document.push({
      type: 'text',
      text: text.join(''),
    });
    return document;
  }
  return document;
}

function buildRow(
  googleTableRow: GoogleDocsTypes.Schema$TableRow,
  googleDocument: GoogleDocsTypes.Schema$Document,
): Doc[] {
  if (googleTableRow.tableCells) {
    return googleTableRow.tableCells.map(
      (googleTableCell: GoogleDocsTypes.Schema$TableCell) =>
        buildCell(googleTableCell, googleDocument),
    );
  }
  return [];
}

function buildTable(
  googleTable: GoogleDocsTypes.Schema$Table,
  googleDocument: GoogleDocsTypes.Schema$Document,
): DocTable {
  if (googleTable.tableRows) {
    return {
      type: 'table',
      table: googleTable.tableRows.map(
        (googleTableRow: GoogleDocsTypes.Schema$TableRow) =>
          buildRow(googleTableRow, googleDocument),
      ),
    };
  }
  return { type: 'table', table: [] };
}

export function buildDocument(
  googleDocument: GoogleDocsTypes.Schema$Document,
): Doc {
  const document: Doc = { document: [] };
  if (googleDocument.body && googleDocument.body.content) {
    googleDocument.body.content.forEach(
      (content: GoogleDocsTypes.Schema$StructuralElement) => {
        if (content.paragraph) {
          const text: DocText = {
            type: 'text',
            text: buildParagraph(content.paragraph, googleDocument),
          };
          document.document.push(text);
        }

        if (content.table) {
          const table: DocTable = buildTable(content.table, googleDocument);
          document.document.push(table);
        }
      },
    );
  }
  return document;
}
