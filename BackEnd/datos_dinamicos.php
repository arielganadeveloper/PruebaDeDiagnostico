<?php
require 'connection.php';

// archivo para obtener los datos de las tablas bodegas, monedas, sucurdsales 

header('Content-Type: application/json');

try {
    if (!isset($_GET['tabla'])) {
        throw new Exception('Parámetro "tabla" no especificado.');
    }

    $tabla = $_GET['tabla'];
    $resultado = [];

    switch ($tabla) {
        case 'bodegas':
            $stmt = $pdo->query("SELECT id, nombre FROM bodegas");
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            break;

        case 'monedas':
            $stmt = $pdo->query("SELECT id, nombre FROM monedas");
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            break;

        case 'sucursales':
            if (!isset($_GET['bodega_id'])) {
                throw new Exception('Parámetro "bodega_id" requerido para sucursales.');
            }
            $stmt = $pdo->prepare("SELECT id, nombre FROM sucursales WHERE bodega_id = ?");
            $stmt->execute([$_GET['bodega_id']]);
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            break;

        default:
            throw new Exception('Tabla no reconocida.');
    }

    echo json_encode($resultado);

} catch (Exception $e) {
    http_response_code(400); 
    echo json_encode(['error' => $e->getMessage()]);
}
