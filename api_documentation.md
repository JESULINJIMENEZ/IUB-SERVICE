# Documentación de la API - IUB Service

Esta documentación describe las rutas principales del backend para la gestión de Campus, Áreas y Aires. Incluye ejemplos de uso con Postman y detalles de los datos requeridos y devueltos.

---

## Autenticación

> **Nota:** Todas las rutas bajo `/admin` requieren autenticación JWT y rol `admin`.

---

## Campus

### Crear Campus

- **POST** `/admin/campus`
- **Body (JSON):**
  ```json
  {
    "name": "Campus Central",
    "address": "Calle 123",
    "city": "Ciudad Ejemplo"
  }
  ```
- **Respuesta exitosa:**  
  `201 Created`  
  ```json
  {
    "message": "Campus creado exitosamente",
    "campus": { ... }
  }
  ```

### Obtener todos los Campus

- **GET** `/admin/campus`
- **Respuesta:**  
  `200 OK`  
  ```json
  [
    {
      "id": 1,
      "name": "Campus Central",
      "address": "Calle 123",
      "city": "Ciudad Ejemplo",
      "Areas": [
        { "id": 1, "name": "Área A" }
      ]
    }
  ]
  ```

### Obtener Campus por ID

- **GET** `/admin/campus/:id`
- **Respuesta:**  
  `200 OK`  
  ```json
  {
    "id": 1,
    "name": "Campus Central",
    "address": "Calle 123",
    "city": "Ciudad Ejemplo",
    "Areas": [
      {
        "id": 1,
        "name": "Área A",
        "Aires": [
          { "id": 1, "name": "Aire 1" }
        ]
      }
    ]
  }
  ```

### Actualizar Campus

- **PUT** `/admin/campus/:id`
- **Body (JSON):**
  ```json
  {
    "name": "Campus Actualizado",
    "address": "Nueva dirección",
    "city": "Nueva Ciudad"
  }
  ```
- **Respuesta:**  
  `200 OK`  
  ```json
  {
    "message": "Campus actualizado exitosamente",
    "campus": { ... }
  }
  ```

---

## Área

### Crear Área

- **POST** `/admin/area`
- **Body (JSON):**
  ```json
  {
    "campus_id": 1,
    "name": "Área A"
  }
  ```
- **Respuesta:**  
  `201 Created`  
  ```json
  {
    "id": 1,
    "campus_id": 1,
    "name": "Área A"
  }
  ```

### Obtener todas las Áreas

- **GET** `/admin/area`
- **Respuesta:**  
  `200 OK`  
  ```json
  [
    {
      "id": 1,
      "campus_id": 1,
      "name": "Área A",
      "Campus": { "id": 1, "name": "Campus Central" },
      "Aires": [ { "id": 1, "name": "Aire 1" } ]
    }
  ]
  ```

### Obtener Área por ID

- **GET** `/admin/area/:id`
- **Respuesta:**  
  `200 OK`  
  ```json
  {
    "id": 1,
    "campus_id": 1,
    "name": "Área A",
    "Campus": { "id": 1, "name": "Campus Central" },
    "Aires": [ { "id": 1, "name": "Aire 1" } ]
  }
  ```

### Actualizar Área

- **PUT** `/admin/area/:id`
- **Body (JSON):**
  ```json
  {
    "campus_id": 1,
    "name": "Área Actualizada"
  }
  ```
- **Respuesta:**  
  `200 OK`  
  ```json
  {
    "id": 1,
    "campus_id": 1,
    "name": "Área Actualizada",
    "Campus": { ... },
    "Aires": [ ... ]
  }
  ```

### Eliminar Área

- **DELETE** `/admin/area/:id`
- **Respuesta:**  
  `204 No Content`

---

## Aire

### Crear Aire

- **POST** `/admin/aire`
- **Tipo:** `form-data` (no JSON)
- **Campos requeridos:**
  - `aireName`: nombre del aire (string)
  - `area_id`: id del área (number)
  - `fileName`: nombre del archivo (string)
  - `mainFile`: archivo principal (file)
  - `additionalFiles`: archivos adicionales (file, opcional, múltiple)

- **Ejemplo en Postman:**
  - Selecciona `POST`
  - En "Body" elige `form-data`
  - Agrega los campos mencionados (los archivos como tipo "File")

- **Respuesta:**  
  `201 Created`  
  ```json
  {
    "id": 1,
    "name": "Aire 1",
    "area_id": 1,
    "file_id": 1
  }
  ```

### Obtener todos los Aires

- **GET** `/admin/aire`
- **Respuesta:**  
  `200 OK`  
  ```json
  [
    {
      "id": 1,
      "name": "Aire 1",
      "area_id": 1,
      "file_id": 1,
      "File": {
        "id": 1,
        "name": "Archivo Aire",
        "mainFile": { "url": "http://localhost:3000/file/..." },
        "additionalFiles": [
          { "url": "http://localhost:3000/file/..." }
        ]
      }
    }
  ]
  ```

### Obtener Aire por ID

- **GET** `/admin/aire/:id`
- **Respuesta:**  
  `200 OK`  
  ```json
  {
    "id": 1,
    "name": "Aire 1",
    "area_id": 1,
    "file_id": 1,
    "File": { ... }
  }
  ```

### Actualizar Aire

- **PUT** `/admin/aire/:id`
- **Tipo:** `form-data`
- **Campos opcionales:**  
  - `aireName` (string)
  - `area_id` (number)
  - `fileName` (string)
  - `mainFile` (file)
  - `additionalFiles` (file, múltiple)

- **Ejemplo en Postman:**  
  Igual que en crear, pero solo envía los campos que deseas actualizar.

- **Respuesta:**  
  `200 OK`  
  ```json
  {
    "id": 1,
    "name": "Aire Actualizado",
    "area_id": 1,
    "file_id": 1,
    "File": { ... }
  }
  ```

### Eliminar Aire

- **DELETE** `/admin/aire/:id`
- **Respuesta:**  
  `200 OK`  
  ```json
  { "message": "Aire eliminado exitosamente" }
  ```

---

## Notas Generales

- Todos los endpoints devuelven errores claros en caso de datos inválidos o recursos no encontrados.
- Para rutas que requieren archivos, usa `form-data` en Postman.
- Las URLs de archivos devueltos pueden ser usadas directamente para descargar los archivos.

---

¿Dudas? Contacta al equipo backend.
