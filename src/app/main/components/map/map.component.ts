import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';

import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { resolve } from 'node:path';
import { rotate } from 'ol/transform';
import Control from 'ol/control/Control';
import VectorSource from 'ol/source/Vector';
import { Source, Vector } from 'ol/source';
import VectorLayer from 'ol/layer/Vector.js';
import Draw from 'ol/interaction/Draw.js';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Geom, Geometry, Tipos, updateParcela } from '../../interfaces/draw.interfaces';
import Interaction from 'ol/interaction/Interaction';
import Select from 'ol/interaction/Select.js';
import "ol-ext/dist/ol-ext.css"
import LayerSwitcher from "ol-ext/control/LayerSwitcher.js";
import XYZ from 'ol/source/XYZ.js';
import { title } from 'node:process';
import { toLonLat } from 'ol/proj';
import { Parcelas, ParcelasInfo } from '../../interfaces/parcelas.interfaces';
import { Geometry as gemotries } from 'ol/geom';
import SearchFeature from 'ol-ext/control/SearchFeature.js';
import { asArray } from 'ol/color';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';
import Modify from 'ol/interaction/Modify.js';

import FullScreen from 'ol/control/FullScreen.js';


@Component({
  selector: 'app-map',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'

})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {

  private platformId = inject(PLATFORM_ID);

  public vectorSource = new VectorSource();
  //revisar la documentacion
  public i_selected = new Select({})

  public isDraw = true

  @Output()
  modalActiveEmitter = new EventEmitter<boolean>;

  @Output()
  Pacelageom = new EventEmitter<Geom>;

  @Input()
  public Parcelas: Parcelas[] = []

  @Output()
  public ObjParcela = new EventEmitter<ParcelasInfo>;

  @Output()
  public ModifiObj = new EventEmitter<updateParcela>;

  @Output() modalModify = new EventEmitter<boolean>;



  @ViewChild('map') mapElement!: ElementRef<HTMLElement>
  map!: Map;
  Tipos = Tipos

  seachControl: any;

  private mapClickSubscription: any; //subscription para eventos del mapa


  ngOnChanges(changes: SimpleChanges): void {

    //lo primero que hay que hacer es eliminar todas las capas de parcelas que ya existan
    const layersToRemove = this.map.getLayers().getArray().filter(layer => layer.get('title') === 'Parcelas');
    layersToRemove.forEach(layer => this.map.removeLayer(layer));

    //ahi que crear features a partir de las parcelas recibidas
    console.log('ha sucedido un cambio',this.Parcelas);
    const features: Feature<gemotries>[] = this.Parcelas.map((parcela) => {
      const geojson = new GeoJSON({ dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
      //const feature = geojson.readFeature(parcela.ubicacion, { featureProjection: 'EPSG:3857' });
      const geojsonObject = {
        type: 'Feature',
        geometry: parcela.ubicacion,
        properties: {
          id: parcela.id,
          nombre: parcela.nombre,
          user_id: parcela.user_id,
        },
      };
      return geojson.readFeatures(geojsonObject, { featureProjection: 'EPSG:3857' })[0];
    })



    this.vectorSource.clear();
    this.vectorSource.addFeatures(features);

    const vectorLayer2 = new VectorLayer({ source: this.vectorSource, properties: { title: 'Parcelas' } });

    this.map.addLayer(vectorLayer2);

    this.map.getView().fit(this.vectorSource.getExtent(), { padding: [50, 50, 50, 50], maxZoom: 15, duration: 1000 });


  }

  ngOnDestroy() {
  if (this.mapClickSubscription) {
    this.mapClickSubscription.unsubscribe();
    // O si es un event listener de OpenLayers:
    this.map.un('click', this.mapClickSubscription);
  }
}


  ngAfterViewInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.map = new Map({
        target: this.mapElement.nativeElement,
        layers: [
          new TileLayer({
            source: new OSM(),
            properties: {
              title: 'OSM',
            }

          }),
          new TileLayer({
            source: new XYZ({
              url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
              attributions: '©Google Maps Satellite Hybrid'
            }),
            properties: {
              title: 'Google Maps Satellite Hybrid',
              visible: false

            }
          }

          )
        ],
        //la posición inicial del mapa se define con coordenadas en EPSG:3857 en este caso, usar conversor de coordenadas si es necesario
        view: new View({
          center: [-8679577.48125514, -114961.2858325622],
          zoom: 7,
        }),
      });


      //agregar e switcher de capas
      const switchCapas = new LayerSwitcher({ mouseover: true });
      this.map.addControl(switchCapas);


      //agregar control de busqueda de parcelas
      this.seachControl = new SearchFeature({
        source: this.vectorSource,
        property: 'nombre',
      } as any);

      this.map.addControl(this.seachControl);



      //agregamos estilos para resaltar el texto de busqueda



      //crear interacion de seleccion de parcelas
      const selectP = new Select({ style: this.getStyles })
      this.map.addInteraction(selectP);



      //hacer zoon al area
      this.seachControl.on('select', (event: any) => {


        selectP.getFeatures().clear();
        selectP.getFeatures().push(event.search);
        const geometry = event.search.getGeometry()!.getFirstCoordinate();
        this.map.getView().animate({ zoom: 16, center: geometry, duration: 1000 });

        //agregar el control modify por si se quiere modificar la parcela
        const modify = new Modify({ features: selectP.getFeatures() });
        this.map.addInteraction(modify);
        //funcion que se activa al iniciar la modificacion de la parcela
        modify.on('modifystart', (e) => {
          //esto va a cerrar el modal que actualiza al momento de iniciar la modificacion
          this.modalModify.emit(false);
        })


        //funcion que se activa al terminar de modificar la parcela
        modify.on('modifyend', (e) => {

          const formato = new GeoJSON({ dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
          const geojson = JSON.parse(formato.writeFeature(e.features.getArray()[0]))

          const obj: updateParcela = {
            id: e.features.getArray()[0].get('id'),
            nombre: e.features.getArray()[0].get('nombre'),
            ubicacion: geojson.geometry
          }


          this.ModifiObj.emit(obj)


          this.modalModify.emit(true)

        })


      })

      const fullscreen = new FullScreen()

      this.map.addControl(fullscreen);

      this.map.on('click', (event) => {
        const features = this.map.getFeaturesAtPixel(event.pixel);

        this.map.forEachFeatureAtPixel(event.pixel, (feature) => {

          const obj: ParcelasInfo = {
            id: feature.get('id'),
            nombre: feature.get('nombre'),
            user_id: feature.get('user_id'),
          }


          this.ObjParcela.emit(obj);

        })

      })




    } else {
      console.log('No es plataforma browser, estoy en el servidor');
    }



  }
  //getStyles

  getStyles(feature: any) {
    const stileB = new Style({
      fill: new Fill({
        color: 'rgba(255, 123, 0, 0.5)'
      }),
      text: new Text(
        {
          text: feature.get('nombre') || 'Sin nombre',
          fill: new Fill({
            color: 'black',

          }),
          font: '16px Arial'
        }
      )
    })

    return stileB;
  }

  //hacer que sea una promesa para que se pueda usar en otros componentes
  async GetLatLng(): Promise<any> {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const obj = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        return obj
      })
    }
    else { return 0 }
  }

  //dibujar terreno
  toolBars(tipo: string) {



    //if para definir que tipo de dibujo se va a utilizar
    if (tipo == 'Polygon') {
      const i_poligon = new Draw({ type: 'Polygon', source: this.vectorSource })
      this.dibujarElemento(i_poligon);

      //TODO!=: MOSTRAR UN MODAL PARA CREAR LA PARCELA..AUN NO SE ALMACENARAN LOS DATOS
      i_poligon.on('drawend', (event) => {


        i_poligon.setActive(false);
        this.enableModal()

        //se agrega el feature al vector source
        const feature = event.feature;


        //se envia el id del punto dibujado al padre
        this.descargarElementos(feature)

      });

    } else if (tipo == 'Circle') {
      const i_circle = new Draw({ type: 'Circle', source: this.vectorSource })

      this.dibujarElemento(i_circle);
      i_circle.on('drawend', (event) => {

        i_circle.setActive(false);
        this.enableModal()
        //se agrega el feature al vector source
        const feature = event.feature;


        //se envia el id del punto dibujado al padre
        this.descargarElementos(feature)
      });

    } else if (tipo == 'Point') {

      const i_point = new Draw({ type: 'Point', source: this.vectorSource })

      this.dibujarElemento(i_point);
      i_point.on('drawend', (event) => {

        i_point.setActive(false);
        this.enableModal()
        //se agrega el feature al vector source
        const feature = event.feature;


        //se envia el id del punto dibujado al padre
        this.descargarElementos(feature)

      });

    }
    else {
      console.error('propiedad no definida');
    }







    const vectorLayer = new VectorLayer({ source: this.vectorSource })

    this.map.addLayer(vectorLayer)





  }

  dibujarElemento(i_dibujo: Interaction) {
    this.map.addInteraction(i_dibujo)

  }

  limpiarElementos() {
    this.vectorSource.clear();

  }

  descargarElementos(feature: Feature<any>) {
    const formato = new GeoJSON({ dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });

    // const feature = this.vectorSource.getFeatureByUid(feature_id)

    // const features = this.vectorSource.getFeatures();

    const geojson = JSON.parse(formato.writeFeature(feature))

    // const arrayParcelas = features.map((parcela) => {
    //   return JSON.parse(formato.writeFeature(parcela))
    // })


    const objeto: Geom = geojson.geometry
    // objeto.coordinates = toLonLat(objeto.coordinates as [number, number]);

    this.Pacelageom.emit(objeto)
  }

  guardarParcela() {
    const parcela = this.map.getAllLayers()

    //aqui se envia mediante output al componente padre para que se guarde en el backend
  }

  eliminarunElemento() {

  }

  enableModal() {

    this.modalActiveEmitter.emit(true)
  }


  buscarParcela() {




  }

}
