# PF-05: Inventario Básico para Farmacia

**Estudiante:** Joshua Israel Flores Pérez
**Carné:** 9941-25-9403
**Repositorio:** https://github.com/joshua26if-sudo/pf-05-inventario-farmacia/tree/main/farmacia

## Descripción del Proyecto

Sistema web para administrar el inventario de una farmacia de barrio. Permite gestionar medicamentos, registrar entradas y salidas (actualizando el stock automáticamente), detectar productos con stock bajo, y calcular el valor total del inventario.

## Tecnologías

- Java 17+ / Spring Boot 3
- PostgreSQL
- Maven
- HTML, CSS, JavaScript

## Requisitos del Entorno

- JDK 17 o superior instalado.
- PostgreSQL instalado y en ejecución.
- Maven instalado.
- IDE de preferencia (IntelliJ IDEA, Eclipse, etc.).

## Configuración de PostgreSQL

1. Crear una base de datos llamada `farmacia_db`.
2. Ejecutar el script `db/schema.sql` para crear las tablas.
3. Ejecutar el script `db/data.sql` para insertar los datos de prueba.
4. Configurar la conexión en `src/main/resources/application.properties`.
   _La contraseña debe manejarse con la variable de entorno `DB_PASSWORD`._

## Ejecución del Backend

1. Clonar el repositorio.
2. Abrir la terminal en la carpeta raíz.
3. Ejecutar: `mvn spring-boot:run`
4. El servidor iniciará en `http://localhost:8080`.

## Ejecución del Frontend

El frontend está integrado en Spring Boot (carpeta `static`). Una vez iniciado el backend, abrir en el navegador:
`http://localhost:8080`

## Endpoints Principales

- `GET /api/medicamentos` : Lista todos los medicamentos activos.
- `POST /api/medicamentos` : Crea un nuevo medicamento.
- `PUT /api/medicamentos/{id}` : Actualiza un medicamento.
- `DELETE /api/medicamentos/{id}` : Desactiva un medicamento.
- `GET /api/medicamentos/categoria/{cat}` : Filtro por categoría (solo activos).
- `GET /api/medicamentos/stock-bajo` : Filtro de stock bajo (solo activos).
- `GET /api/medicamentos/inventario/valor` : Indicador del valor total.
- `POST /api/movimientos` : Registrar entrada o salida.
- `GET /api/movimientos/medicamento/{id}` : Historial de movimientos.

## Colección de Postman

En la carpeta `/db` se encuentra el archivo JSON con todas las peticiones HTTP exportadas para probar la API.
