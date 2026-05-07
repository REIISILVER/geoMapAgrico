# GeoMap Agrícola - Gestor de Terrenos con Mapas

Sistema fullstack para gestionar terrenos agrícolas. Permite dibujar polígonos en el mapa, asignar cultivos y registrar información de producción.

## ✨ Funcionalidades principales
- Dibujo y edición de terrenos con **OpenLayers**
- Gestión de cultivos y productos por terreno
- Autenticación de usuarios
- API REST con Laravel 12
- Dashboard responsive

## 🛠️ Tecnologías
**Backend:**
- Laravel 12 + PHP
- PostgreSQL / MySQL
- Docker + Docker Compose
- Eloquent ORM

**Frontend:**
- Angular 19 + TypeScript
- OpenLayers
- ...



## 🚀 Cómo ejecutar localmente

```bash
# Backend
cd geoMapAgrico_Backend
cp .env.example .env
docker-compose up --build -d

# Frontend
cd geoMapAgrico
npm install
ng serve
