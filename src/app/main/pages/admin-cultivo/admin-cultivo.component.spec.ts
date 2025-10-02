import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCultivoComponent } from './admin-cultivo.component';

describe('AdminCultivoComponent', () => {
  let component: AdminCultivoComponent;
  let fixture: ComponentFixture<AdminCultivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCultivoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCultivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
