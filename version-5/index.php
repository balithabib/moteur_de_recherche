<?php
include 'index/indexation.inc.php';
include 'mysql/server.inc.php';
include 'visualization/cloud.php';

# path of all files
$EXTENSION = '.html';

$MAIN_DIRECTORY = '../data';

$documents = [index_one_html_file("../data/Apprenez à programmer en C ! - OpenClassrooms.html")];

//save_documents($documents);

?>

