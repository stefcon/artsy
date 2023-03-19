import { TestBed } from '@angular/core/testing';

import { AdminOrgGuard } from './admin-org.guard';

describe('AdminOrgGuard', () => {
  let guard: AdminOrgGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminOrgGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
