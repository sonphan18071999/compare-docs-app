import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as monaco from 'monaco-editor';
import { SafeHtmlPipe } from '../safe-html.pipe';
import { CommonModule } from '@angular/common';

interface DiffChange {
  value: string;
  added?: boolean;
  removed?: boolean;
}

@Component({
  selector: 'app-document-comparison',
  templateUrl: './document-comparison.component.html',
  styleUrls: ['./document-comparison.component.scss'],
  standalone: true,
  providers: [SafeHtmlPipe],
  imports: [CommonModule],
})
export class DocumentComparisonComponent implements OnInit, AfterViewInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

  private editor: monaco.editor.IStandaloneDiffEditor | null = null;

  public originalHTML = `
    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>#</th><th>Name</th><th>Age</th><th>Country</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1</td><td>Alice</td><td>30</td><td>USA</td></tr>
        <tr><td>2</td><td>Bob</td><td>25</td><td>Canada</td></tr>
        <tr><td>3</td><td>Charlie</td><td>35</td><td>UKA</td></tr>
      </tbody>
    </table>
  `;

  public modifiedHTML = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Aligned Header and Table</title>
  <style>
    .container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    .header {
      text-align: center;
    }

    p {
      margin-bottom: 16px;
      text-align: center;
      margin:auto;
    }

    table {
      border-collapse: collapse;
      width: 100%;
    }

    th, td {
      border: 1px solid #333;
      padding: 8px;
      text-align: left;
    }

    thead {
      background-color: #f2f2f2;
    }
    
  </style>
</head>
<body>
  <div class="container">
  <div class="header">
    <p><strong>Hello</strong></p>
  </div>
  <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Age</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Alice</td>
          <td>30</td>
          <td>USA</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Bob</td>
          <td>26</td>
          <td>Canada</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Charlie</td>
          <td>35</td>
          <td>UK</td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>

  `;

  public originalPreview: string = '';
  public modifiedPreview: string = '';

  getCleanText(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Function to extract text with structure from any node
    const extractTextWithStructure = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Text node - return its content
        return node.textContent?.trim() || '';
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();

        // Handle specific HTML elements to preserve structure
        if (tagName === 'br') {
          return '\n';
        } else if (
          tagName === 'p' ||
          tagName === 'div' ||
          tagName === 'h1' ||
          tagName === 'h2' ||
          tagName === 'h3' ||
          tagName === 'h4' ||
          tagName === 'h5' ||
          tagName === 'h6'
        ) {
          // Block elements - add newlines
          let content = '';
          for (let i = 0; i < element.childNodes.length; i++) {
            content += extractTextWithStructure(element.childNodes[i]);
          }
          return content + '\n';
        } else if (tagName === 'tr') {
          // Table rows - extract cells and join with tabs
          const cells = Array.from(element.querySelectorAll('td, th'));
          return (
            cells.map((cell) => cell.textContent?.trim() || '').join('\t') +
            '\n'
          );
        } else {
          // Other elements - process children
          let content = '';
          for (let i = 0; i < element.childNodes.length; i++) {
            content += extractTextWithStructure(element.childNodes[i]);
          }
          return content;
        }
      }
      return '';
    };

    // Start extraction from the body
    let result = extractTextWithStructure(doc.body);

    // Clean up extra whitespace while preserving structure
    result = result
      .replace(/\n\s+/g, '\n') // Remove leading whitespace on lines
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines to max 2
      .trim();

    return result;
  }

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.originalPreview = this.originalHTML;
    this.modifiedPreview = this.modifiedHTML;
  }

  ngAfterViewInit(): void {
    this.initMonacoEditor();
  }

  private initMonacoEditor(): void {
    if (!this.editorContainer) return;

    // Set up editor options
    const options: monaco.editor.IDiffEditorConstructionOptions = {
      renderSideBySide: true,
      automaticLayout: true,
      readOnly: true,
      originalEditable: false,
      diffAlgorithm: 'advanced',
      ignoreTrimWhitespace: false,
    };

    // Create diff editor and manually set theme afterward
    this.editor = monaco.editor.createDiffEditor(
      this.editorContainer.nativeElement,
      options
    );

    // Set theme
    monaco.editor.setTheme('vs');

    // Create models
    const originalModel = monaco.editor.createModel(
      this.getCleanText(this.originalHTML),
      'text'
    );
    const modifiedModel = monaco.editor.createModel(
      this.getCleanText(this.modifiedHTML),
      'text'
    );

    // Set models
    this.editor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });
  }
}
