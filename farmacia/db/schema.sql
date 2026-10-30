CREATE TABLE medicamento (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario > 0),
    stock_actual INT NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
    stock_minimo INT NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
    fecha_vencimiento DATE NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE movimiento_inventario (
    id BIGSERIAL PRIMARY KEY,
    medicamento_id BIGINT NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('ENTRADA','SALIDA')),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    fecha TIMESTAMP NOT NULL,
    motivo VARCHAR(200),
    stock_resultante INT NOT NULL,
    CONSTRAINT fk_mov_med FOREIGN KEY (medicamento_id) REFERENCES medicamento(id)
);