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

  public originalHTML = `<html>

<head>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<meta name=Generator content="Microsoft Word 15 (filtered)">
<style>
<!--
 /* Font Definitions */
 @font-face
	{font-family:Wingdings;
	panose-1:5 0 0 0 0 0 0 0 0 0;}
@font-face
	{font-family:"Cambria Math";
	panose-1:2 4 5 3 5 4 6 3 2 4;}
@font-face
	{font-family:Aptos;
	panose-1:2 11 0 4 2 2 2 2 2 4;}
 /* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin-top:0in;
	margin-right:0in;
	margin-bottom:8.0pt;
	margin-left:0in;
	line-height:115%;
	font-size:12.0pt;
	font-family:"Aptos",sans-serif;}
p.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph
	{margin-top:0in;
	margin-right:0in;
	margin-bottom:8.0pt;
	margin-left:.5in;
	line-height:115%;
	font-size:12.0pt;
	font-family:"Aptos",sans-serif;}
p.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst
	{margin-top:0in;
	margin-right:0in;
	margin-bottom:0in;
	margin-left:.5in;
	line-height:115%;
	font-size:12.0pt;
	font-family:"Aptos",sans-serif;}
p.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle
	{margin-top:0in;
	margin-right:0in;
	margin-bottom:0in;
	margin-left:.5in;
	line-height:115%;
	font-size:12.0pt;
	font-family:"Aptos",sans-serif;}
p.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast
	{margin-top:0in;
	margin-right:0in;
	margin-bottom:8.0pt;
	margin-left:.5in;
	line-height:115%;
	font-size:12.0pt;
	font-family:"Aptos",sans-serif;}
.MsoChpDefault
	{font-size:12.0pt;
	font-family:"Aptos",sans-serif;}
.MsoPapDefault
	{margin-bottom:8.0pt;
	line-height:115%;}
@page WordSection1
	{size:8.5in 11.0in;
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

<p class=MsoNormal><span style='font-family:"Courier New"'>Bbaananna</span></p>

<p class=MsoNormal><b><span style='font-family:"Courier New"'>Banananaboi dam </span></b></p>

<p class=MsoNormal><b><i><span style='font-family:"Courier New"'>Catcu</span></i></b></p>

<p class=MsoNormal><b><i><u><span style='font-family:"Courier New"'>Mothaiba</span></u></i></b></p>

<p class=MsoListParagraph style='text-indent:-.25in'><span style='font-family:
Symbol'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span><b><i><u><span style='font-family:"Courier New"'>NguyenSon</span></u></i></b></p>

<table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0
 style='border-collapse:collapse;border:none'>
 <tr>
  <td width=208 valign=top style='width:155.8pt;border:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>1</span></p>
  </td>
  <td width=208 valign=top style='width:155.85pt;border:solid windowtext 1.0pt;
  border-left:none;padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>3</span></p>
  </td>
  <td width=208 valign=top style='width:155.85pt;border:solid windowtext 1.0pt;
  border-left:none;padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>4</span></p>
  </td>
 </tr>
 <tr>
  <td width=208 valign=top style='width:155.8pt;border:solid windowtext 1.0pt;
  border-top:none;padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>abc</span></p>
  </td>
  <td width=208 valign=top style='width:155.85pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>abc</span></p>
  </td>
  <td width=208 valign=top style='width:155.85pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>abc</span></p>
  </td>
 </tr>
 <tr>
  <td width=208 valign=top style='width:155.8pt;border:solid windowtext 1.0pt;
  border-top:none;padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>abc</span></p>
  </td>
  <td width=208 valign=top style='width:155.85pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>abc</span></p>
  </td>
  <td width=208 valign=top style='width:155.85pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>abc</span></p>
  </td>
 </tr>
</table>

<p class=MsoNormal><span style='font-family:"Courier New"'>&nbsp;</span></p>

</div>

</body>

</html>

  `;

  public modifiedHTML = `<html>

<head>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<meta name=Generator content="Microsoft Word 15 (filtered)">
<style>
<!--
 /* Font Definitions */
 @font-face
	{font-family:"Cambria Math";
	panose-1:2 4 5 3 5 4 6 3 2 4;}
@font-face
	{font-family:Aptos;
	panose-1:2 11 0 4 2 2 2 2 2 4;}
 /* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin-top:0in;
	margin-right:0in;
	margin-bottom:8.0pt;
	margin-left:0in;
	line-height:115%;
	font-size:12.0pt;
	font-family:"Aptos",sans-serif;}
.MsoChpDefault
	{font-size:12.0pt;
	font-family:"Aptos",sans-serif;}
.MsoPapDefault
	{margin-bottom:8.0pt;
	line-height:115%;}
@page WordSection1
	{size:8.5in 11.0in;
	margin:1.0in 1.0in 1.0in 1.0in;}
div.WordSection1
	{page:WordSection1;}
-->
</style>

</head>

<body lang=EN-US style='word-wrap:break-word'>

<div class=WordSection1>

<p class=MsoNormal><span style='font-family:"Courier New"'>Adspf </span></p>

<table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0
 style='border-collapse:collapse;border:none'>
 <tr>
  <td width=208 valign=top style='width:155.8pt;border:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>1</span></p>
  </td>
  <td width=208 valign=top style='width:155.85pt;border:solid windowtext 1.0pt;
  border-left:none;padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>3</span></p>
  </td>
  <td width=208 valign=top style='width:155.85pt;border:solid windowtext 1.0pt;
  border-left:none;padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>4</span></p>
  </td>
 </tr>
 <tr>
  <td width=208 valign=top style='width:155.8pt;border:solid windowtext 1.0pt;
  border-top:none;padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>abc</span></p>
  </td>
  <td width=208 valign=top style='width:155.85pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>abc</span></p>
  </td>
  <td width=208 valign=top style='width:155.85pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>abc</span></p>
  </td>
 </tr>
 <tr>
  <td width=208 valign=top style='width:155.8pt;border:solid windowtext 1.0pt;
  border-top:none;padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>abc</span></p>
  </td>
  <td width=208 valign=top style='width:155.85pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>abc</span></p>
  </td>
  <td width=208 valign=top style='width:155.85pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Courier New"'>banana</span></p>
  </td>
 </tr>
</table>

<p class=MsoNormal><span style='font-family:"Courier New"'>&nbsp;</span></p>

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
