import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosTableComponent } from './recursos-table.component';

describe('RecursosTableComponent', () => {
  let component: RecursosTableComponent;
  let fixture: ComponentFixture<RecursosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursosTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecursosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
