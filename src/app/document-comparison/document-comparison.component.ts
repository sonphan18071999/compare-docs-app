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

  private mockOriginalContent = `<html>

<head>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<meta name=Generator content="Microsoft Word 15 (filtered)">
<style>
<!--
 /* Font Definitions */
 @font-face
	{font-family:"Cambria Math";
	panose-1:2 4 5 3 5 4 6 3 2 4;}
 /* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin:0in;
	line-height:115%;
	font-size:11.0pt;
	font-family:"Arial",sans-serif;}
.MsoChpDefault
	{font-family:"Arial",sans-serif;}
.MsoPapDefault
	{line-height:115%;}
@page WordSection1
	{size:595.45pt 841.7pt;
	margin:1.0in 1.0in 1.0in 1.0in;}
div.WordSection1
	{page:WordSection1;}
 /* List Definitions */
 ol
	{margin-bottom:0in;}
ul
	{margin-bottom:0in;}
-->
</style>

</head>

<body lang=EN-US style='word-wrap:break-word'>

<div class=WordSection1>

<p class=MsoNormal><span lang=vi>Todo list:</span></p>

<p class=MsoNormal style='margin-left:.5in;text-indent:-.25in'><span lang=vi>●<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
lang=vi>Item 1</span></p>

<p class=MsoNormal style='margin-left:.5in;text-indent:-.25in'><span lang=vi>●<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
lang=vi>Item 2</span></p>

<p class=MsoNormal style='margin-left:.5in;text-indent:-.25in'><span lang=vi>●<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
lang=vi>Item 3</span></p>

<p class=MsoNormal style='margin-left:.5in;text-indent:-.25in'><span lang=vi>●<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
lang=vi>Item 4</span></p>

</div>

</body>

</html>
`;

  private mockModifiedContent = `
<html>

<head>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<meta name=Generator content="Microsoft Word 15 (filtered)">
<style>
<!--
 /* Font Definitions */
 @font-face
	{font-family:"Cambria Math";
	panose-1:2 4 5 3 5 4 6 3 2 4;}
 /* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin:0in;
	line-height:115%;
	font-size:11.0pt;
	font-family:"Arial",sans-serif;}
.MsoChpDefault
	{font-family:"Arial",sans-serif;}
.MsoPapDefault
	{line-height:115%;}
@page WordSection1
	{size:595.45pt 841.7pt;
	margin:1.0in 1.0in 1.0in 1.0in;}
div.WordSection1
	{page:WordSection1;}
 /* List Definitions */
 ol
	{margin-bottom:0in;}
ul
	{margin-bottom:0in;}
-->
</style>

</head>

<body lang=EN-US style='word-wrap:break-word'>

<div class=WordSection1>

<p class=MsoNormal><span lang=vi>Todo list:</span></p>

<p class=MsoNormal style='margin-left:.5in;text-indent:-.25in'><span lang=vi>●<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
lang=vi>Item 1</span></p>

<p class=MsoNormal style='margin-left:.5in;text-indent:-.25in'><span lang=vi>●<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
lang=vi>Item 3</span></p>

<p class=MsoNormal style='margin-left:.5in;text-indent:-.25in'><span lang=vi>●<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
lang=vi>Item 4</span></p>
<p class=MsoNormal style='margin-left:.5in;text-indent:-.25in'><span lang=vi>●<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span
lang=vi>Item 5</span></p>

</div>

</body>

</html>
`;

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

    // Replace br tags with newlines
    const brTags = tempDiv.getElementsByTagName('br');
    for (let i = brTags.length - 1; i >= 0; i--) {
      const br = brTags[i];
      br.parentNode?.replaceChild(document.createTextNode('\n'), br);
    }

    // Get the text content and normalize whitespace while preserving newlines
    let text = tempDiv.textContent || tempDiv.innerText || '';
    text = text.replace(/[ \t]+/g, ' ').trim(); // Only normalize spaces and tabs, not newlines

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
