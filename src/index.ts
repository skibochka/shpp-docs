import fs from 'fs';
import { buildDocument } from './service';
import { Doc } from './interfaces';
import { docs_v1 as GoogleDocsTypes } from 'googleapis';

function convertGoogleDocToMarkdown(path: string): Doc | null {
  try {
    const googleDocumentFile: Buffer = fs.readFileSync(path);
    const googleDocumentString: string = googleDocumentFile.toString();
    const googleDocument: GoogleDocsTypes.Schema$Document = JSON.parse(
      googleDocumentString,
    );
    return buildDocument(googleDocument);
  } catch (error) {
    return null;
  }
}

const file = JSON.stringify(
  convertGoogleDocToMarkdown('googleDoc.json'),
  null,
  2,
);
fs.writeFileSync('convertedDoc', file);
