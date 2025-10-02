import { Ubicacion } from './cultivos.interfaces';
export enum Tipos {
  Point = 'Point',
  LineString = 'LineString',
  LinearRing = 'LinearRing',
  Polygon = 'Polygon', MultiPoint = 'MultiPoint',
  MultiLineString = 'MultiLineString',
  MultiPolygon = 'MultiPolygon',
  GeometryCollection = 'GeometryCollection',
  Circle = 'Circle'
}

export interface Geometry {
  tipos: Tipos
}


export interface Geom {
  type: string,
  coordinates: number[];

}

export interface updateParcela {
  id: number,
  nombre?: string,
  ubicacion?: Geom
}

//PROBLE RASUELTO ESTA AL MOMENTO DE GUARDAR , SE ENVIA UBCICACION CON COORDINATES PERO SOLO DEBE ENVIARSE UBICACION
