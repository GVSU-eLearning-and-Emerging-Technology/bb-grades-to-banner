import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackboardLoaderComponent } from './blackboard-loader.component';

describe('BlackboardLoaderComponent', () => {
  let component: BlackboardLoaderComponent;
  let fixture: ComponentFixture<BlackboardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlackboardLoaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlackboardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
