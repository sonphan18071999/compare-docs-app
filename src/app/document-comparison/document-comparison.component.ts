import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as monaco from 'monaco-editor';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FileConverterService } from '../services/file-converter.service';

interface DiffChange {
  value: string;
  added?: boolean;
  removed?: boolean;
}

interface ComparisonResult {
  similarity: number;
  distance: number;
  differences?: Array<{
    type: string;
    description: string;
  }>;
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
  public originalPreview: SafeHtml = '';
  public modifiedPreview: SafeHtml = '';
  comparisonResult: ComparisonResult | null = null;

  // Mock data for testing
  private mockComparisonResults: ComparisonResult[] = [
    {
      similarity: 100,
      distance: 0,
      differences: [],
    },
    {
      similarity: 85,
      distance: 42,
      differences: [
        { type: 'content', description: 'Different text in paragraph 3' },
        { type: 'formatting', description: 'Different font size in section 2' },
      ],
    },
  ];

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

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private safeHtmlPipe: SafeHtmlPipe,
    private fileConverter: FileConverterService
  ) {}

  ngOnInit(): void {
    this.initializeMonaco();
  }

  ngAfterViewInit(): void {
    this.initializeMonaco();
  }

  private initializeMonaco(): void {
    if (this.editorContainer && !this.editor) {
      this.editor = monaco.editor.createDiffEditor(
        this.editorContainer.nativeElement,
        {
          readOnly: true,
          renderSideBySide: true,
          automaticLayout: true,
          theme: 'vs-dark',
        }
      );
    }
  }

  async onFileChange(
    event: Event,
    type: 'original' | 'modified'
  ): Promise<void> {
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

  async compareFiles(): Promise<void> {
    if (!this.originalFile || !this.modifiedFile) {
      alert('Please select both original and modified files');
      return;
    }

    try {
      // Convert files to HTML
      const [originalHtml, modifiedHtml] = await Promise.all([
        this.fileConverter.convertFileToHtml(this.originalFile),
        this.fileConverter.convertFileToHtml(this.modifiedFile),
      ]);

      // Update the editor content
      this.originalHTML = originalHtml;
      this.modifiedHTML = modifiedHtml;
      this.originalPreview = this.safeHtmlPipe.transform(originalHtml);
      this.modifiedPreview = this.safeHtmlPipe.transform(modifiedHtml);

      // Update Monaco editor
      if (this.editor) {
        this.editor.setModel({
          original: monaco.editor.createModel(originalHtml, 'html'),
          modified: monaco.editor.createModel(modifiedHtml, 'html'),
        });
      }

      // Mock the comparison result
      this.comparisonResult =
        this.mockComparisonResults[
          Math.floor(Math.random() * this.mockComparisonResults.length)
        ];
    } catch (error) {
      console.error('Error comparing files:', error);
      alert(
        'Error comparing files. Please make sure the files are valid HTML or DOCX files.'
      );
    }
  }
}
