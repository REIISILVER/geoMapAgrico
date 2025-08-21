import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateParcelaComponent } from './modal-create-parcela.component';

describe('ModalCreateParcelaComponent', () => {
  let component: ModalCreateParcelaComponent;
  let fixture: ComponentFixture<ModalCreateParcelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateParcelaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateParcelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
