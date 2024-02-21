import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeColumnChooserPageComponent } from './grade-column-chooser-page.component';

describe('GradeColumnChooserPageComponent', () => {
  let component: GradeColumnChooserPageComponent;
  let fixture: ComponentFixture<GradeColumnChooserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GradeColumnChooserPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradeColumnChooserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
