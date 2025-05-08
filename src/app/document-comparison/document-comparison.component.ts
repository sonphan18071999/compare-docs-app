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
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  imports: [CommonModule, HttpClientModule],
})
export class DocumentComparisonComponent implements OnInit, AfterViewInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

  private editor: monaco.editor.IStandaloneDiffEditor | null = null;
  private originalFile: File | null = null;
  private modifiedFile: File | null = null;

  public originalFileName: string = '';
  public modifiedFileName: string = '';
  public originalHTML = '';
  public modifiedHTML = '';
  public originalPreview: string = '';
  public modifiedPreview: string = '';

  public getCleanText(html: string): string {
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

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}

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

  onFileChange(event: Event, type: 'original' | 'modified'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (type === 'original') {
      this.originalFile = file;
      this.originalFileName = file.name;
    } else {
      this.modifiedFile = file;
      this.modifiedFileName = file.name;
    }
  }

  compareFiles(): void {
    if (!this.originalFile || !this.modifiedFile) {
      alert('Please select both files to compare');
      return;
    }

    const formData = new FormData();
    formData.append('originalFile', this.originalFile);
    formData.append('modifiedFile', this.modifiedFile);

    this.http.post('/api/compare', formData).subscribe({
      next: (response: any) => {
        this.originalHTML = response.originalContent;
        this.modifiedHTML = response.modifiedContent;
        this.originalPreview = response.originalContent;
        this.modifiedPreview = response.modifiedContent;
        this.updateEditor();
      },
      error: (error) => {
        console.error('Error comparing files:', error);
        alert('Error comparing files. Please try again.');
      },
    });
  }

  private updateEditor(): void {
    if (!this.editor) return;

    const originalModel = monaco.editor.createModel(
      this.getCleanText(this.originalHTML),
      'text'
    );
    const modifiedModel = monaco.editor.createModel(
      this.getCleanText(this.modifiedHTML),
      'text'
    );

    this.editor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });
  }
}
