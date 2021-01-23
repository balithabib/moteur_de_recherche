<?php
include 'indexation.inc.php';

# path of all files
$path_file_html = 'data/page_1.html';
$path_file_stop_words = 'stop_words.txt';

# list of separators
$separators = ":;,!?.'’()«» 0123456789\n";

# read html file
$text = file_get_contents($path_file_html);

# read list of stop words
$array_stop_words = get_array_stop_words($path_file_stop_words);

# tokenize html file
$tab_words = explode_html($path_file_html, $text, $separators, $array_stop_words);
print_tab_tab($tab_words);
?>



id1 actualité: 2
id2 direct: 1
id3 photos: 1

id_document "id1,id2,id3"
