<?php
include 'index/indexation.inc.php';
include 'mysql/server.inc.php';
include 'visualization/cloud.php';

# path of all files
$EXTENSION = '.html';

$MAIN_DIRECTORY = '../data';

$documents = index_multiple_html_files($MAIN_DIRECTORY);

save_documents($documents);

?>

