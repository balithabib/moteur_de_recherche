<?php
function connexionPDO()
{
    $login = "root";
    $password = "test";
    $dbname = "bdd_tiw";
    $server = "localhost";
    //echo "connexion on $server:$dbname with : $login\n";

    try {
        return new PDO("mysql:host=$server;dbname=$dbname", $login, $password);
    } catch (PDOException $e) {
        echo "Error connexion PDO, $e\n";
        die();
    }
}

?>