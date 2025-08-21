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
