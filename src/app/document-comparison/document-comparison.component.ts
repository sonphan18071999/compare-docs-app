import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as monaco from 'monaco-editor';
import * as diff from 'diff';
import { SafeHtmlPipe } from '../safe-html.pipe';

interface DiffChange {
  value: string;
  added?: boolean;
  removed?: boolean;
}

@Component({
  selector: 'app-document-comparison',
  templateUrl: './document-comparison.component.html',
  styleUrls: ['./document-comparison.component.scss'],
  imports: [SafeHtmlPipe],
  standalone: true,
})
export class DocumentComparisonComponent implements OnInit, AfterViewInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  @ViewChild('previewContainer', { static: true })
  previewContainer!: ElementRef;
  private editor: monaco.editor.IStandaloneDiffEditor | null = null;
  private originalContent: string = '';
  private modifiedContent: string = '';
  public originalPreview: string = '';
  public modifiedPreview: string = '';

  private mockOriginalContent = `
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <title>Converted Document</title>
  <meta name="Generator" content="PowerTools for Open XML" />
  <style>
    span { 
      white-space: pre-wrap;
      font-family: inherit;
      font-size: inherit;
      color: inherit;
    }
  </style>
</head>
<body>
  <div>
    <p dir="ltr" style="font-family: Frutiger 45 Light;font-size: 10pt;line-height: 14.2pt;margin-bottom: .001pt;margin-left: 0;margin-right: 0;margin-top: 0;">
      <span lang="de-DE" xml:space="preserve" style="font-family: Frutiger 45 Light;font-size: 10pt;font-style: normal;font-weight: normal;margin: 0;padding: 0;"> </span>
    </p>
    <p dir="ltr" style="font-family: 'Times New Roman', 'serif';font-size: 11pt;line-height: 108%;margin-bottom: .001pt;margin-left: 0;margin-right: 0;margin-top: 0;">
      <span lang="de-DE" style="font-family: 'Times New Roman', 'serif';font-size: 11pt;font-style: normal;font-weight: normal;margin: 0;padding: 0;">S</span>
      <span lang="de-DE" style="font-family: 'Times New Roman', 'serif';font-size: 8pt;font-style: normal;font-weight: normal;margin: 0;padding: 0;">ehr geehrt</span>
      <span lang="de-DE" style="font-family: 'Times New Roman', 'serif';font-size: 11pt;font-style: normal;font-weight: normal;margin: 0;padding: 0;">e D</span>
      <span lang="de-DE" style="font-family: 'Times New Roman', 'serif';font-size: 11pt;font-style: normal;font-weight: bold;margin: 0;padding: 0;">amen und Herren,</span>
    </p>
    <p dir="ltr" style="font-family: 'Times New Roman', 'serif';font-size: 11pt;line-height: 108%;margin-bottom: .001pt;margin-left: 0;margin-right: 0;margin-top: 0;">
      <span lang="de-DE" style="font-family: 'Times New Roman', 'serif';font-size: 11pt;font-style: normal;font-weight: normal;margin: 0;padding: 0;">Mit freundlichen Grüßen hello</span>
      <span lang="de-DE" >my baby hello</span>
    </p>
  </div>
</body>
</html>`;

  private mockModifiedContent = `
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <title>Converted Documents</title>
  <meta name="Generator" content="PowerTools for Open XML" />
  <style>
    span { 
      white-space: pre-wrap;
      font-family: inherit;
      font-size: inherit;
      color: inherit;
    }
  </style>
</head>
<body>
  <div>
    <p dir="ltr" style="font-family: 'Segoe UI', 'sans-serif';font-size: 10pt;line-height: 14.2pt;margin-bottom: .001pt;margin-left: 0;margin-right: 0;margin-top: 0;">
      <span lang="de-DE" style="color: #000000;font-family: 'Segoe UI', 'sans-serif';font-size: 10pt;font-style: normal;font-weight: normal;margin: 0;padding: 0;">ABC123</span>
    </p>
    <p dir="ltr" style="font-family: 'Segoe UI', 'sans-serif';font-size: 10pt;line-height: 14.2pt;margin-bottom: .001pt;margin-left: 0;margin-right: 0;margin-top: 0;">
      <span lang="de-DE" xml:space="preserve" style="color: #000000;font-family: 'Segoe UI', 'sans-serif';font-size: 10pt;font-style: normal;font-weight: normal;margin: 0;padding: 0;"> </span>
    </p>
    <p dir="ltr" style="font-family: 'Times New Roman', 'serif';font-size: 11pt;line-height: 108%;margin-bottom: .001pt;margin-left: 0;margin-right: 0;margin-top: 0;">
      <span lang="de-DE" style="color: #000000;font-family: 'Times New Roman', 'serif';font-size: 11pt;font-style: normal;font-weight: normal;margin: 0;padding: 0;">S</span>
      <span lang="de-DE" style="color: #000000;font-family: 'Times New Roman', 'serif';font-size: 8pt;font-style: normal;font-weight: normal;margin: 0;padding: 0;">ehr geehrt</span>
      <span lang="de-DE" style="color: #000000;font-family: 'Times New Roman', 'serif';font-size: 11pt;font-style: normal;font-weight: normal;margin: 0;padding: 0;">e D</span>
      <span lang="de-DE" style="color: #000000;font-family: 'Times New Roman', 'serif';font-size: 11pt;font-style: normal;font-weight: bold;margin: 0;padding: 0;">amen und Herren,</span>
    </p>
    <p dir="ltr" style="font-family: 'Times New Roman', 'serif';font-size: 11pt;line-height: 108%;margin-bottom: .001pt;margin-left: 0;margin-right: 0;margin-top: 0;">
      <span lang="de-DE" style="color: #000000;font-family: 'Times New Roman', 'serif';font-size: 11pt;font-style: normal;font-weight: bold;margin: 0;padding: 0;">Mit freundlichen Grüßen</span>
    </p>
    <p dir="ltr" style="font-family: Frutiger 45 Light;font-size: 11pt;line-height: 14.2pt;margin-bottom: .001pt;margin-left: 0;margin-right: 0;margin-top: 0;">
      <span lang="de-DE" xml:space="preserve" style="font-family: Frutiger 45 Light;font-size: 11pt;font-style: normal;font-weight: normal;margin: 0;padding: 0;"> </span>
    </p>
  </div>
</body>
</html>`;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeEditor();
    // Load mock data after editor initialization
    this.updateContent(this.mockOriginalContent, this.mockModifiedContent);
  }

  private initializeEditor(): void {
    const container = this.editorContainer.nativeElement;

    this.editor = monaco.editor.createDiffEditor(container, {
      automaticLayout: true,
      readOnly: true,
      renderSideBySide: true,
      originalEditable: false,
    });
  }

  private removeHtmlTags(html: string): string {
    // Create a temporary div element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Remove style tags
    const styleTags = tempDiv.getElementsByTagName('style');
    while (styleTags.length > 0) {
      styleTags[0].parentNode?.removeChild(styleTags[0]);
    }

    // Get the text content and normalize whitespace
    let text = tempDiv.textContent || tempDiv.innerText || '';
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  }

  private highlightDifferences(original: string, modified: string): string {
    const originalText = this.removeHtmlTags(original);
    const modifiedText = this.removeHtmlTags(modified);

    const changes: DiffChange[] = diff.diffLines(originalText, modifiedText);
    let highlightedModified = modifiedText;

    changes.forEach((change: DiffChange) => {
      if (change.added) {
        const lines: string[] = change.value.split('\n');
        lines.forEach((line: string) => {
          if (line.trim()) {
            const escapedLine = line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedLine, 'g');
            highlightedModified = highlightedModified.replace(
              regex,
              `<span class="highlight-difference">${line}</span>`
            );
          }
        });
      }
    });

    return highlightedModified;
  }

  public updateContent(original: string = '', modified: string = ''): void {
    if (this.editor) {
      this.originalContent = original;
      this.modifiedContent = modified;

      // Sanitize and remove HTML tags before displaying in editor
      const originalText = this.removeHtmlTags(original);
      const modifiedText = this.removeHtmlTags(modified);

      const originalModel = monaco.editor.createModel(
        originalText,
        'plaintext'
      );
      const modifiedModel = monaco.editor.createModel(
        modifiedText,
        'plaintext'
      );

      this.editor.setModel({
        original: originalModel,
        modified: modifiedModel,
      });

      // Update previews with text content and highlighted differences
      this.originalPreview = originalText;
      const highlightedModified = this.highlightDifferences(original, modified);
      this.modifiedPreview = highlightedModified;
    }
  }
}
