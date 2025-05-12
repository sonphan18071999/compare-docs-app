import { Injectable } from '@angular/core';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import * as pptx2html from 'pptx2html';

@Injectable({
  providedIn: 'root',
})
export class FileConverterService {
  constructor() {
    // Initialize PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdfjs/pdf.worker.js';
  }

  async convertFileToHtml(file: File): Promise<string> {
    const fileType = file.name.split('.').pop()?.toLowerCase();

    switch (fileType) {
      case 'html':
      case 'htm':
        return this.convertHtmlToHtml(file);
      case 'docx':
        return this.convertDocxToHtml(file);
      case 'pdf':
        return this.convertPdfToHtml(file);
      case 'pptx':
        return this.convertPptxToHtml(file);
      case 'xlsx':
      case 'xls':
        return this.convertExcelToHtml(file);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  private async convertHtmlToHtml(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  private async convertDocxToHtml(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.convertToHtml({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
  }

  private async convertPdfToHtml(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let html = '<div class="pdf-content">';

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageHtml = textContent.items
              .map((item: any) => `<p>${item.str}</p>`)
              .join('');
            html += `<div class="pdf-page">${pageHtml}</div>`;
          }

          html += '</div>';
          resolve(html);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
  }

  private async convertPptxToHtml(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const html = await pptx2html.convert(arrayBuffer);
          resolve(html);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
  }

  private async convertExcelToHtml(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          let html = '<div class="excel-content">';

          // Convert each sheet to HTML
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
            }) as string[][];

            html += `<div class="excel-sheet">
              <h3>${sheetName}</h3>
              <table>
                ${jsonData
                  .map(
                    (row: string[]) => `
                  <tr>
                    ${row
                      .map((cell: string) => `<td>${cell || ''}</td>`)
                      .join('')}
                  </tr>
                `
                  )
                  .join('')}
              </table>
            </div>`;
          });

          html += '</div>';
          resolve(html);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
  }
}
