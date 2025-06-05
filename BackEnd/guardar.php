<?php
require 'connection.php';

header('Content-Type: application/json');

// archivo para insertar el producto en la bd

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $codigo = $_POST['codigo'] ?? '';
    $nombre = $_POST['nombre'] ?? '';
    $bodega_id = $_POST['bodega'] ?? '';
    $sucursal_id = $_POST['sucursal'] ?? '';
    $moneda_id = $_POST['moneda'] ?? '';
    $precio = $_POST['precio'] ?? '';
    $descripcion = $_POST['descripcion'] ?? '';
    $materiales = $_POST['material'] ?? [];

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("INSERT INTO productos (codigo, nombre, bodega_id, sucursal_id, moneda_id, precio, descripcion)
                               VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$codigo, $nombre, $bodega_id, $sucursal_id, $moneda_id, $precio, $descripcion]);

        $producto_id = $pdo->lastInsertId();

        $stmtMaterial = $pdo->prepare("INSERT INTO producto_material (producto_id, material) VALUES (?, ?)");
        foreach ($materiales as $mat) {
            $stmtMaterial->execute([$producto_id, $mat]);
        }

        $pdo->commit();

        echo  'Producto guardado exitosamente.';
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo 
            'Error al guardar el producto.';
            
        
    }
}
?>
