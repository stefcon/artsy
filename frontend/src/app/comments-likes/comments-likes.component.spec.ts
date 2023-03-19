import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsLikesComponent } from './comments-likes.component';

describe('CommentsLikesComponent', () => {
  let component: CommentsLikesComponent;
  let fixture: ComponentFixture<CommentsLikesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentsLikesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsLikesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
