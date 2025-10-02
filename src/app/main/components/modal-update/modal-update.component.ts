import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-update',
  imports: [MatButtonModule, MatDialogModule, MatCardModule, TitleCasePipe],
  templateUrl: './modal-update.component.html',
  styleUrl: './modal-update.component.css'
})
export class ModalUpdateComponent {
  @Input() accion: string = ''
  @Output() event = new EventEmitter<boolean>();
  readonly dialog = inject(MatDialog);
  public modalStatus: boolean = false;

  openDialog() {
    this.dialog.open(ModalUpdateComponent);

    this.dialog.afterAllClosed.subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  TriggerEvent(status: boolean) {
    this.accion === 'eliminar' ? this.delete(status) : this.Update(status);

  }

  delete(status: boolean) {
                    //es para enviar que si se va a eliminar
    status == true ? this.event.emit(true) : this.event.emit(false); // esto es para cerrar el modal

  }

  Update(status: boolean) {
    if (status) {

      this.event.emit(status);
    } else {

      this.event.emit(status);

    }
  }



}
