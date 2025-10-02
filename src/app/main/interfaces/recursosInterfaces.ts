export interface Recursos {
  id: number;
  nombre: string;
  descripcion?: string | null;
  tipo: string;
  cantidad: number;
  unidad: string;
  cultivo_id: number;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface FormRecursos {
  nombre: string;
  descripcion?: string | null;
  tipo: string;
  cantidad: number;
  unidad: string;
  cultivo_id?: number;
}
