export interface DocText {
  type: 'text';
  text: string;
}

export interface DocTable {
  type: 'table';
  table: Doc[][];
}

export interface Doc {
  document: (DocText | DocTable)[];
}
