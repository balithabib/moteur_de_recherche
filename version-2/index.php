<?php
include 'index/indexation.inc.php';
include 'mysql/server.inc.php';

# path of all files
$EXTENSION = '.html';
$MAIN_DIRECTORY = 'data/';

$documents = index_multiple_html_files($MAIN_DIRECTORY);

/*$html_file_path = 'data/page_3.html';
$documents = [
    to_document(
        $html_file_path,
        $html_file_path,
        get_meta_tags($html_file_path)['description'],
        index_one_html_file($html_file_path)
    )
];*/

save_documents($documents);

?>

