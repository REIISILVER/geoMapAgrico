import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ParcelasInfo } from '../../interfaces/parcelas.interfaces';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-actividades-modal',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './actividades-modal.component.html',
  styleUrl: './actividades-modal.component.css'
})
export class ActividadesModalComponent {
  @Input()
  public actividades  = []
  @Input()
  public informacionParcela: ParcelasInfo = {
    id: 0,
    nombre: '',
    user_id: 0
  }

  @Output()
  public closeModal = new EventEmitter<boolean>;


  cancel(){
    console.log('cerrar modal');
    this.closeModal.emit(false);
  }

}
