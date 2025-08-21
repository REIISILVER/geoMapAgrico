export interface HttpParcelas{
  data: Parcelas[];
}

export interface Parcelas {
    id:        number;
    nombre:    string;
    ubicacion: Ubicacion;
    user_id:   number;
}

export interface Ubicacion {
    type:        string;
    coordinates: number[];
}


export interface ParcelasInfo {
    id:      number;
    nombre:  string;
    user_id: number;
}
