import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableActividadesComponent } from './table-actividades.component';

describe('TableActividadesComponent', () => {
  let component: TableActividadesComponent;
  let fixture: ComponentFixture<TableActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableActividadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
