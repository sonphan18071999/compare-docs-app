import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DocumentComparisonComponent } from './document-comparison/document-comparison.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DocumentComparisonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'compare-docs-app';
}
