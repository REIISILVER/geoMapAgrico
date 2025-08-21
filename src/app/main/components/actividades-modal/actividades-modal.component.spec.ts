import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesModalComponent } from './actividades-modal.component';

describe('ActividadesModalComponent', () => {
  let component: ActividadesModalComponent;
  let fixture: ComponentFixture<ActividadesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
