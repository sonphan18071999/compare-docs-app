import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentComparisonComponent } from './document-comparison.component';

describe('DocumentComparisonComponent', () => {
  let component: DocumentComparisonComponent;
  let fixture: ComponentFixture<DocumentComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
