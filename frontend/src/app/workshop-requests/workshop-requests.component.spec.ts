import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopRequestsComponent } from './workshop-requests.component';

describe('WorkshopRequestsComponent', () => {
  let component: WorkshopRequestsComponent;
  let fixture: ComponentFixture<WorkshopRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkshopRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshopRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
