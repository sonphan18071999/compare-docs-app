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

  private mockOriginalContent = `
<html>

<head>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<meta name=Generator content="Microsoft Word 15 (filtered)">
<style>
<!--
 /* Font Definitions */
 @font-face
	{font-family:Helv;
	panose-1:2 11 6 4 2 2 2 3 2 4;}
@font-face
	{font-family:Wingdings;
	panose-1:5 0 0 0 0 0 0 0 0 0;}
@font-face
	{font-family:"Cambria Math";
	panose-1:2 4 5 3 5 4 6 3 2 4;}
@font-face
	{font-family:Tahoma;
	panose-1:2 11 6 4 3 5 4 4 2 4;}
@font-face
	{font-family:"Frutiger 45 Light";}
@font-face
	{font-family:"Frutiger 47LightCn";}
 /* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin:0in;
	line-height:14.15pt;
	font-size:10.0pt;
	font-family:"Frutiger 45 Light";}
.MsoChpDefault
	{font-size:10.0pt;}
 /* Page Definitions */
 @page WordSection1
	{size:595.3pt 841.9pt;
	margin:86.75pt 21.25pt 53.85pt 70.9pt;}
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

<body lang=EN-US link=blue vlink=purple style='word-wrap:break-word'>

<div class=WordSection1>

<table class=MsoNormalTable border=1 cellspacing=0 cellpadding=0 width="100%"
 style='border-collapse:collapse;border:none'>
 <tr style='height:14.2pt'>
  <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>an</span></p>
  </td>
  <td width=388 valign=top style='width:290.65pt;border:solid windowtext 1.0pt;
  border-left:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>siehe Verteiler</span></p>
  </td>
  <td width=177 rowspan=13 valign=top style='width:132.9pt;border:solid windowtext 1.0pt;
  border-left:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 width=205
   style='margin-left:8.8pt;border-collapse:collapse'>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Vorstand:</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Wolfgang Kirsch, Vorsitzender</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Wolfgang Köhler</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Dr. Cornelius Riese</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Thomas Ullrich</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Stefan Zeidler</span></p>
    </td>
   </tr>
   <tr style='height:4.25pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:4.25pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'> </span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Vorsitzender des Aufsichtsrats:</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Helmut Gottschalk</span></p>
    </td>
   </tr>
   <tr style='height:4.25pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:4.25pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'> </span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>AZ BANK AG</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Deutsche</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Zentral-Genossenschaftsbank,</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Frankfurt am Main</span></p>
    </td>
   </tr>
   <tr style='height:4.25pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:4.25pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'> </span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Sitz:</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Frankfurt am Main</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Amtsgericht Frankfurt am Main</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Handelsregister HRB 45651</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'> </span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt;font-family:"Frutiger 47LightCn"'>USt.-Ident.-Nr.
    DE 114103491</span></p>
    </td>
   </tr>
  </table>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  </td>
 </tr>
 <tr style='height:14.2pt'>
  <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
  border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>Fax</span></p>
  </td>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>siehe Verteiler</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Seiten</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>2</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:6.55pt'>
   <td width=121 valign=top style='width:90.4pt;border-top:none;border-left:
   solid windowtext 1.0pt;border-bottom:solid windowtext 1.0pt;border-right:
   none;padding:0in 5.4pt 0in 5.4pt;height:6.55pt'><span lang=DE
   style='font-size:4.0pt;font-family:"Frutiger 45 Light"'> </span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border:none;border-bottom:
  solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:6.55pt'>
  <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
  4.0pt'> </span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Von</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>AZ BANK AG<br>
  <br>
  Platz der Republik<br>
  <br>
  60325 Frankfurt am Main</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Ansprechpartner</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>Matthias Bortfeld</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Abteilung</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>Dokumentation strukturierte Produkte</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Telefon</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Fax</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>+49 69 7447-1906</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>E-Mail</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>Ihs.neuemission@dzbank.de</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:3.8pt'>
   <td width=121 valign=top style='width:90.4pt;border-top:none;border-left:
   solid windowtext 1.0pt;border-bottom:solid windowtext 1.0pt;border-right:
   none;padding:0in 5.4pt 0in 5.4pt;height:3.8pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'> </span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border:none;border-bottom:
  solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:3.8pt'>
  <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
  11.0pt'> </span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Datum</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>10/11/2024</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Betreff</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal><span lang=DE style='font-size:11.0pt'>Kündiung der</span></p>
  <p class=MsoNormal><span lang=DE style='font-size:11.0pt'>EUR 20,000,000
  variabel verzinsliche bevorrechtigte nicht nachrangige  Schuldverschreibungen  von 2014/2024, Emission A388 - ISIN: MB999DZ1J6R6</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
 </table>
 <span lang=DE style='font-size:9.0pt;font-family:"Frutiger 45 Light";
 color:white'> </span>
 <p class=MsoNormal style='line-height:normal'><b><u><span lang=DE
 style='font-size:9.0pt'>Verteiler:</span></u></b></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>WERTPAPIER-MITTEILUNGEN                                    floater@wmdaten.com</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Clearstream Banking AG, Ffm.                                  new-issues-bonds@clearstream.com</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Clearstream Operations Prague s.r.o.                          Income-NCSC@clearstream.com</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Euroclear                                                                new_issues@euroclear.com</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Bloomberg                                                              emeacapmkts@bloomberg.net</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Telekurs                                                                  bonds@telekurs.com</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>KLER'S Srl                                                 finance.idk@interactivedata.com</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Standard &amp; Poor's                                                    newissuance@standardandpoors.com</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>F/GTIE Hartmut Schulz                                             hartmut.schulz@dzbank.de</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>M/OSSE                                                                   #s-eigene-emissionen</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Bondhandel                                                             #s-zinsprodukte</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>F/PKBZ  Thomas Wagner                                          thomas.wagner@dzbank.de                                                     </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>F/PKBZ   Andre Korn                                                 andre.korn@dzbank.de</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>F/PKBZ Stenia Schmidt                                             stenia.schmidt@dzbank.de</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>F/OSOM-RECON                                                       #s-OSOM-RECON</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Murex                                                                     #S-Murex.Service</span></p>
 <p class=MsoNormal><span lang=SV> </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'>Sehr geehrte Damen und Herren,</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'> </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'>hiermit möchten wir Ihnen mitteilen, dass die im Betreff genannte
 Emission der AZ BANK AG gemäß § 5 Absatz (2) der Anleihebedingungen insgesamt
 mit Wirkung zum <b>11. October 2024 </b>gekündigt und zum Nennbetrag
 zurückgezahlt wird.</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'> </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'>Mit freundlichen Grüßen</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'> </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'>AZ BANK AG</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'> </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'> </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'> </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'>Bortfeld </span></p>
</tr>
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
	{font-family:Helv;
	panose-1:2 11 6 4 2 2 2 3 2 4;}
@font-face
	{font-family:Wingdings;
	panose-1:5 0 0 0 0 0 0 0 0 0;}
@font-face
	{font-family:"Cambria Math";
	panose-1:2 4 5 3 5 4 6 3 2 4;}
@font-face
	{font-family:"Frutiger 45 Light";}
@font-face
	{font-family:Tahoma;
	panose-1:2 11 6 4 3 5 4 4 2 4;}
@font-face
	{font-family:"Frutiger 47LightCn";}
 /* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin:0in;
	line-height:14.15pt;
	font-size:10.0pt;
	font-family:"Frutiger 45 Light";}
.MsoChpDefault
	{font-size:10.0pt;}
 /* Page Definitions */
 @page WordSection1
	{size:595.3pt 841.9pt;
	margin:86.75pt 21.25pt 53.85pt 70.9pt;}
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

<body lang=EN-US link=blue vlink=purple style='word-wrap:break-word'>

<div class=WordSection1>

<table class=MsoNormalTable border=1 cellspacing=0 cellpadding=0 width="100%"
 style='border-collapse:collapse;border:none'>
 <tr style='height:14.2pt'>
  <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>an</span></p>
  </td>
  <td width=388 valign=top style='width:290.65pt;border:solid windowtext 1.0pt;
  border-left:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>siehe Verteiler</span></p>
  </td>
  <td width=177 rowspan=13 valign=top style='width:132.9pt;border:solid windowtext 1.0pt;
  border-left:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 width=205
   style='margin-left:8.8pt;border-collapse:collapse'>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Vorstand:</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Wolfgang Kirsch, Vorsitzender</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Wolfgang Köhler</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Dr. Cornelius Riese</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Thomas Ullrich</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Stefan Zeidler</span></p>
    </td>
   </tr>
   <tr style='height:4.25pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:4.25pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'> </span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Vorsitzender des Aufsichtsrats:</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Helmut Gottschalk</span></p>
    </td>
   </tr>
   <tr style='height:4.25pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:4.25pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'> </span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>AZ BANK AG</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Deutsche</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Zentral-Genossenschaftsbank,</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Frankfurt am Main</span></p>
    </td>
   </tr>
   <tr style='height:4.25pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:4.25pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'> </span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Sitz:</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Frankfurt am Main</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Amtsgericht Frankfurt am Main</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'>Handelsregister HRB 45651</span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt'> </span></p>
    </td>
   </tr>
   <tr style='height:9.35pt'>
    <td width=205 valign=top style='width:153.6pt;padding:0in 5.4pt 0in 5.4pt;
    height:9.35pt'>
    <p class=MsoNormal style='margin-right:-56.7pt;line-height:normal'><span
    lang=DE style='font-size:6.5pt;font-family:"Frutiger 47LightCn"'>USt.-Ident.-Nr.
    DE 114103491</span></p>
    </td>
   </tr>
  </table>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  </td>
 </tr>
 <tr style='height:14.2pt'>
  <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
  border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>Fax</span></p>
  </td>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>siehe Verteiler</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Seiten</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>2</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:6.55pt'>
   <td width=121 valign=top style='width:90.4pt;border-top:none;border-left:
   solid windowtext 1.0pt;border-bottom:solid windowtext 1.0pt;border-right:
   none;padding:0in 5.4pt 0in 5.4pt;height:6.55pt'><span lang=DE
   style='font-size:4.0pt;font-family:"Frutiger 45 Light"'> </span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border:none;border-bottom:
  solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:6.55pt'>
  <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
  4.0pt'> </span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Von</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>AZ BANK AG123</span><span lang=DE><br>
  <br>
  </span><span lang=DE style='font-size:11.0pt'>Platz der Republik</span><span
  lang=DE><br>
  <br>
  </span><span lang=DE style='font-size:11.0pt'>60325 Frankfurt am Main</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Ansprechpartner</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>Matthias Bortfeld</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Abteilung</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>Dokumentation strukturierte Produkte</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Telefon</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Fax</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>+49 69 7447-1906</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>E-Mail</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>Ihs.neuemission@dzbank.de</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:3.8pt'>
   <td width=121 valign=top style='width:90.4pt;border-top:none;border-left:
   solid windowtext 1.0pt;border-bottom:solid windowtext 1.0pt;border-right:
   none;padding:0in 5.4pt 0in 5.4pt;height:3.8pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'> </span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border:none;border-bottom:
  solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:3.8pt'>
  <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
  11.0pt'> </span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Datum</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'>10/11/2024</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
  <tr style='height:14.2pt'>
   <td width=121 valign=top style='width:90.4pt;border:solid windowtext 1.0pt;
   border-top:none;padding:0in 5.4pt 0in 5.4pt;height:14.2pt'><span lang=DE
   style='font-size:11.0pt;font-family:"Frutiger 45 Light"'>Betreff</span></td>
  </tr>
  <td width=388 valign=top style='width:290.65pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt;height:14.2pt'>
  <p class=MsoNormal><span lang=DE style='font-size:11.0pt'>Kündiung der</span></p>
  <p class=MsoNormal><span lang=DE style='font-size:11.0pt'>EUR 20,000,000
  variabel verzinsliche bevorrechtigte nicht nachrangige  Schuldverschreibungen  von 2014/2024, Emission A388 - ISIN: MB999DZ1J6R6</span></p>
  </td>
  <p class=MsoNormal style='margin-top:3.0pt;line-height:normal'><span lang=DE
  style='font-size:11.0pt'> </span></p>
 </table>
 <span lang=DE style='font-size:9.0pt;font-family:"Frutiger 45 Light";
 color:white'> </span>
 <p class=MsoNormal style='line-height:normal'><b><u><span lang=DE
 style='font-size:9.0pt'>Verteiler:</span></u></b></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>WERTPAPIER-MITTEILUNGEN                                    floater@wmdaten.com</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Clearstream Banking AG, Ffm.                                     new-issues-bonds@clearstream.com</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Clearstream Operations Prague s.r.o.                      Income-NCSC@clearstream.com</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Euroclear                                                             new_issues@euroclear.com</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Bloomberg                                                             emeacapmkts@bloomberg.net</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Telekurs                                                                 bonds@telekurs.com</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>KLER'S Srl                                                      finance.idk@interactivedata.com</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Standard &amp; Poor's                                                  newissuance@standardandpoors.com</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>F/GTIE Hartmut Schulz                                                 hartmut.schulz@dzbank.de</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>M/OSSE                                                         #s-eigene-emissionen</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Bondhandel                                                         #s-zinsprodukte</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>F/PKBZ  Thomas Wagner                                                 thomas.wagner@dzbank.de</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>F/PKBZ   Andre Korn                                                     andre.korn@dzbank.de</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>F/PKBZ Stenia Schmidt                                                 stenia.schmidt@dzbank.de</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>F/OSOM-RECON                                                         #s-OSOM-RECON</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=SV style='font-size:
 8.0pt'>Murex                                                         #S-Murex.Service</span></p>
 <p class=MsoNormal><span lang=SV> </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'>Sehr geehrte Damen und Herren, ádas</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'>Sehr geehrte Damen und Herren, ádas</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'>Sehr geehrte Damen und Herren, ádas</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'> </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'> </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'>hierm<b>it möchten wir Ihnen mitteil</b>en, dass die im B123etreff
 genannte Emission der AZ BANK AG gemäß § 5 Absatz (2) der Anleihebedingungen
 insgesamt mit Wirkung zum <b>11. October 2024 </b>gekündigt und zum Nennbetrag
 zurückgezahlt wird.</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'> </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'>Mit freundlichen Grüßen</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'> </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'>AZ BANK AG</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'> </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'>123</span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'> </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'> </span></p>
 <p class=MsoNormal style='line-height:normal'><span lang=DE style='font-size:
 11.0pt'>Bortfeld </span></p>
</tr>
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
