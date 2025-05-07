import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DocumentComparisonComponent } from './document-comparison/document-comparison.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { MonacoEditorModule } from 'ngx-monaco-editor';

@NgModule({
  declarations: [AppComponent, DocumentComparisonComponent, SafeHtmlPipe],
  imports: [BrowserModule, MonacoEditorModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
