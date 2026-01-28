import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CultivosService } from '../../services/cultivos.service';
import { Router } from '@angular/router';
import { ClimaService } from '../../services/clima.service';
import { forkJoin, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrentWeather } from '../../interfaces/clima.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { CultivosByID } from '../../interfaces/cultivos.interfaces';
import { MatButtonModule } from '@angular/material/button';
import { WEATHER_CODES } from '../../../../barril/enviroments.prod';
import { FormActividadesComponent } from '../../components/form-actividades/form-actividades.component';
import { CreateActividad, ActividadesByCultivo } from '../../interfaces/actividades.interfaces';
import { ActividadesService } from '../../services/actividades.service';
import { TableActividadesComponent } from '../../components/table-actividades/table-actividades.component';
import { FormRecursosComponent } from '../../components/form-recursos/form-recursos.component';
import { FormRecursos, Recursos } from '../../interfaces/recursosInterfaces';
import { RecursosService } from '../../services/recursos.service';
import { SpinnerComponent } from '../../../barril/shared/spinner/spinner.component';
import { loadingSpinner } from '../../../../barril/helpers';
import { MessageComponent } from '../../../barril/message/message.component';
import { RecursosTableComponent } from '../../components/recursos-table/recursos-table.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { disable } from 'ol/rotationconstraint';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-admin-cultivo',
  imports: [MatIconModule,
     MatCard, ReactiveFormsModule, MatButtonModule,
     FormActividadesComponent, TableActividadesComponent,
     FormRecursosComponent, SpinnerComponent, MessageComponent,
     RecursosTableComponent, MatFormFieldModule, MatDatepickerModule, MatInputModule],
  templateUrl: './admin-cultivo.component.html',
  styleUrl: './admin-cultivo.component.css',
  providers:[provideNativeDateAdapter()]
})
export class AdminCultivoComponent implements OnInit {
  private cultS = inject(CultivosService);
  private climateS = inject(ClimaService);
  private actServ = inject(ActividadesService);
  private recursosS = inject(RecursosService);
  private ruta = inject(Router);

  public clima_obj!: CurrentWeather;
  public cultivoObj!: CultivosByID;
  public actividades!: ActividadesByCultivo[];
  public RecursosObj: Recursos[] = [];

  //obj desde el hijo formularioRecursos
  public recursos!: FormRecursos

  //status modal
  public statusModal: boolean = false;

  //modalForm Recuros
  public modalFormRc: boolean = false;

  //boolean para el spinner
  public loading: boolean = false;

  //formbuilder
  private fb = inject(FormBuilder);

  //formulario con la informacion del cultivo
  public formCultivo: FormGroup = this.fb.group(
    {
      tipo: this.fb.control({ value: '', disabled: true }),
      fecha_cultivo: this.fb.control({ value: '', disabled: true }),
      fecha_cosecha: this.fb.control({ value: '', disabled: true }),
    }
  )

  //estado para editar datos del cultivo
  public editCultivoStatus: boolean = false;


  public messageActive: boolean = false;
  public message: string = 'mensaje de prueba';
  public color: string = '#0a73a3ff';

  //filtro para selecccionar las fechas minimas en los datepicker

  //objeto con los filtros de fechas
  filtros = {
    cultivo: (d: Date | null): boolean => this.fechaMaxima(d,this.formCultivo.get('fecha_cultivo')?.value),
    cosecha: (d: Date | null): boolean => this.fechaMaxima(d, this.formCultivo.get('fecha_cosecha')?.value)
  }

  public myFilter = this.fechaMaxima.bind(this);


  @ViewChild('main') maincontainer!: ElementRef<HTMLElement>


  ngOnInit(): void {
    this.loading = loadingSpinner(this.loading)
    const id_cultivo = Number(this.ruta.url.split('main/cultivo/')[1]);

    this.cultS.obteneCultivoPorId(id_cultivo).pipe(
      tap((cultivo) => {

        this.cultivoObj = cultivo[0]
        this.formCultivo.patchValue({
          tipo: this.cultivoObj.tipo,
          fecha_cultivo: this.cultivoObj.fecha_cultivo,
          fecha_cosecha: this.cultivoObj.fecha_cosecha
        })
      }),
      // switchMap( cultivo => this.climateS.getCurrentWeather(cultivo[0].parcela.ubicacion.coordinates[0][1][1], cultivo[0].parcela.ubicacion.coordinates[0][0][0])),
      switchMap(cultivo => forkJoin({
        clima: this.climateS.getCurrentWeather(cultivo[0].parcela.ubicacion.coordinates[0][1][1], cultivo[0].parcela.ubicacion.coordinates[0][0][0]),
        actvidades: this.actServ.getActividades(cultivo[0].id),
        recursos: this.recursosS.getRecursos(cultivo[0].id)
      }))

    ).subscribe({
      next: ({ clima, actvidades, recursos }) => {

        this.clima_obj = clima

        this.actividades = actvidades

        this.RecursosObj = [...recursos]

        this.loading = loadingSpinner(this.loading)


      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar los datos del cultivo')
        this.loading = loadingSpinner(this.loading)
      }
    })




  }
  getMessage(e: string) {
    this.switchMessage(e);//aqui se va a mostrar el mensaje eliminado
  }

  getWeatherCodes(cod: number) {
    //WEATHER_CODE ES UNA VARIABLE QUE CONTIENE UN DICCIONARIO CON LOS CODIGOS E ICONOS DEL CLIMA POROPORCIONADO OPE OPEN METEOROLOGICA EXPORTABLE DE LA CARPETA BARRIL
    return WEATHER_CODES[cod] || { text: 'desconocido', 'icon': '?' }
  }

  createActividad(e: CreateActividad) {
    this.loading = loadingSpinner(this.loading)
    let obj = e
    obj.cultivo_id = this.cultivoObj.id


    this.actServ.sendActividad(obj).subscribe(
      {
        next: (resp) => {

          this.loading = loadingSpinner(this.loading)
          //actividad creada con exito
          this.switchMessage(resp.mensaje);
          //una vez creada la actividad  se le asigna al input para que se actualice la tabla
          this.actividades = [resp.data, ...this.actividades]
          this.statusModal = false
          this.maincontainer.nativeElement.style.opacity = "1";
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al crear la actividad');
          this.loading = loadingSpinner(this.loading)
          this.maincontainer.nativeElement.style.opacity = "1";
        }
      }
    )
  }

  activateModal() {
    this.statusModal = true;

    this.maincontainer.nativeElement.style.opacity = "0.5";

  }

  getStatus(e: boolean) {
    this.statusModal = e;
    this.maincontainer.nativeElement.style.opacity = "1";

  }

  activateModalRecursos() {
    this.modalFormRc = true;

    this.maincontainer.nativeElement.style.opacity = "0.5";

  }

  getCancelRecuros(e: boolean) {
    this.modalFormRc = e;
    this.maincontainer.nativeElement.style.opacity = "1";

  }

  sendDatos(obj: FormRecursos) {
    //cargando...datos de recursos
    this.loading = loadingSpinner(this.loading)
    this.recursos = obj

    this.recursos.cultivo_id = this.cultivoObj.id


    //TODO: LLAMAR AL SERVICE
    this.recursosS.crearRecurso(this.recursos).subscribe(
      {
        next: (resp) => {

          this.modalFormRc = false;
          this.loading = loadingSpinner(this.loading)
          this.switchMessage(resp.mensaje);


          this.RecursosObj = [resp.data, ...this.RecursosObj]
          this.maincontainer.nativeElement.style.opacity = "1";
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al crear el recurso');
          this.loading = loadingSpinner(this.loading)
          this.switchMessage('Error al crear el recurso');
          this.maincontainer.nativeElement.style.opacity = "1";

        }
      }
    );
  }

  switchMessage(messaje: string) {
    //aqui sucede el cambio
    this.messageActive = true
    this.messageActive = true;
    this.message = messaje;
    setTimeout(() => {
      this.messageActive = false;
    }, 2000);

  }


  //funciones para editar la informacion básica del cultivo
  switchEditCultivoMod(accion: string, campos: string) {
    switch (accion) {
      case 'editar': {
        this.editCultivoStatus = true;

        this.formCultivo.get(campos)?.enable();
        break;
      }
      case 'cancelar': {
        this.editCultivoStatus = false;

        this.formCultivo.get(campos)?.disable();
        break;
      }
    }
  }

  saveEditCultivo() {
    const obj = { ...this.formCultivo.value };
    obj.id = this.cultivoObj.id;

    this.cultS.updateCultivo(obj, this.cultivoObj.id).subscribe(
      {
        next: (resp) => {

          this.switchMessage(resp.mensaje);
          this.editCultivoStatus = false;
          this.formCultivo.disable();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al actualizar el cultivo');
          this.switchMessage(err.message);
          this.editCultivoStatus = false;
          this.formCultivo.disable();
        }
      }
    );
  }

  //funcion para detectar fechas maximas en el datepicker
  fechaMaxima(d: Date | null, fecha_actual: Date ): boolean {

     if (!d) return false;
    const reseteadaF = new Date(d);
    const fechaActual = new Date(fecha_actual);

    // Normalizar fechas (ignorar horas, minutos, segundos)
    reseteadaF.setHours(0, 0, 0, 0);
    fechaActual.setHours(0, 0, 0, 0);






    // Permitir solo fechas futuras (incluyendo hoy)
    return fechaActual.getTime()  <= reseteadaF.getTime() ;
  };





}
