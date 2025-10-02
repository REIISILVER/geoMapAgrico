export interface CreateActividad{
  descripcion: string,
  nombre: string,
  tipo: string,
  cultivo_id?: number
}
//recibir actividades
export interface ActividadesByCultivo {
    id:          number;
    descripcion: string;
    nombre:      string;
    tipo:        string;
    created_at?:  Date;
    updated_at?:  Date;
    cultivo_id:  number;
}

