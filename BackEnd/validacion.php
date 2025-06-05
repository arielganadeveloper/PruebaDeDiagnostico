<?php
require 'connection.php';

//archivo que valida que no se repita el codigo del producto

if (isset($_POST['codigo'])) {
    $codigo = $_POST['codigo'];
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM productos WHERE codigo = ?");
    $stmt->execute([$codigo]);
    $existe = $stmt->fetchColumn();

    echo $existe > 0 ? "existe" : "ok";
}
?>
