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
    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>#</th><th>Name</th><th>Age</th><th>Country</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1</td><td>Alice</td><td>30</td><td>USA</td></tr>
        <tr><td>2</td><td>Bob</td><td>26</td><td>Canada</td></tr>
        <tr><td>3</td><td>Charlie</td><td>35</td><td>UK</td></tr>
      </tbody>
    </table>
  `;

  public originalPreview: string = '';
  public modifiedPreview: string = '';

  getCleanText(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const rows = Array.from(doc.querySelectorAll('tr'));

    return rows
      .map((row) => {
        const cells = Array.from(row.querySelectorAll('th, td'));
        return cells.map((cell) => cell.textContent?.trim() ?? '').join('\t');
      })
      .join('\n');
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
