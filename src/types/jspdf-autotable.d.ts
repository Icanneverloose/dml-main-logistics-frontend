declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';
  
  interface UserOptions {
    startY?: number;
    head?: any[][];
    body?: any[][];
    theme?: 'striped' | 'grid' | 'plain';
    headStyles?: any;
    bodyStyles?: any;
    alternateRowStyles?: any;
    styles?: any;
    margin?: {
      left?: number;
      right?: number;
      top?: number;
      bottom?: number;
    };
  }
  
  function autoTable(doc: jsPDF, options: UserOptions): void;
  export default autoTable;
}

