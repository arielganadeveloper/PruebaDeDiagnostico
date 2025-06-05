-- tabla productos
CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(15) UNIQUE NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  bodega_id INT NOT NULL,
  sucursal_id INT NOT NULL,
  moneda_id INT NOT NULL,
  precio NUMERIC(10,2) NOT NULL,
  descripcion TEXT NOT NULL
);

-- Tabla intermedia producto_material para evitar redundancia 
CREATE TABLE producto_material (
  id SERIAL PRIMARY KEY,
  producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  material VARCHAR(50) NOT NULL
);

-- Bodegas 
CREATE TABLE bodegas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

-- Sucursales
CREATE TABLE sucursales (
  id SERIAL PRIMARY KEY,
  bodega_id INT NOT NULL REFERENCES bodegas(id) ON DELETE CASCADE,
  nombre VARCHAR(50) NOT NULL
);

-- Monedas 
CREATE TABLE monedas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

--Datos Ingresados Para funcionamiento de la app (modificable)
INSERT INTO bodegas (nombre) VALUES ('Bodega Central'), ('Bodega Norte');

INSERT INTO sucursales (bodega_id, nombre) VALUES
  (1, 'Sucursal A'),
  (1, 'Sucursal B'),
  (2, 'Sucursal C');

INSERT INTO monedas (nombre) VALUES ('CLP'), ('USD'), ('EUR');
