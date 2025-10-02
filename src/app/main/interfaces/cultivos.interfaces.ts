export interface CultivosToSend {
    tipo:          string;
    fecha_cultivo: Date;
    fecha_cosecha: Date;
    parcela_id:    number;
}


export interface Cultivos {
    id:            number;
    tipo:          string;
    fecha_cultivo: Date;
    fecha_cosecha: Date;
    parcela_id:    number;
}
export interface cultivosGetResponse{
  data: Cultivos[];
}



export interface CultivosByID {
    id:            number;
    tipo:          string;
    fecha_cultivo: Date;
    fecha_cosecha: Date;
    parcela_id:    number;
    parcela:       Parcela;
}

export interface Parcela {
    ubicacion: Ubicacion;
}

export interface Ubicacion {
    type:        string;
    coordinates: Array<Array<number[]>>;
}



