<?php
# stop words file
$PATH_FILE_STOP_WORDS = 'stop_words.txt';

# list of separators
$SEPARATORS = ":;,!?.'’()«» 0123456789\n";

# read list of stop words
$ARRAY_STOP_WORDS = get_array_stop_words($PATH_FILE_STOP_WORDS);

/*
 * This method index multiple html file
 * */
function index_multiple_html_files($main_directory)
{
    $html_file_list = get_html_files_paths($main_directory);

    $documents = [];
    foreach ($html_file_list as $index => $html_file_path) {
        $documents[] = to_document(
            $html_file_path,
            $html_file_path,
            get_meta_tags($html_file_path)['description'],
            index_one_html_file($html_file_path)
        );
    }
    return $documents;
}

/*
 * This method create a document object
 * */
function to_document($url, $name, $description, $occurrences_and_words)
{
    $document = (object)[];
    $document->occurrences_and_words = $occurrences_and_words;
    $document->name = $name;
    $document->url = $url;
    $document->description = $description;
    return $document;
}

/*
 * This method return the path list of the html files contained in a directory $main_directory
 * */
function get_html_files_paths($main_directory)
{
    $file_and_dir_list = scandir($main_directory);

    $html_file_list = array_filter($file_and_dir_list, function ($item) {
        global $EXTENSION;
        return strlen($item) > 5 and substr($item, -5, 5) == $EXTENSION;
    });

    return array_map(function ($item) {
        global $MAIN_DIRECTORY;
        return $MAIN_DIRECTORY . $item;
    }, $html_file_list);
}

/*
 * This method index one html file
 * */
function index_one_html_file($path_file_html)
{
    global $ARRAY_STOP_WORDS, $SEPARATORS;

    # read html file
    $text = file_get_contents($path_file_html);

    # tokenize html file
    $tab_words = explode_html($path_file_html, $text, $SEPARATORS, $ARRAY_STOP_WORDS);

    return array_count_values($tab_words);
}


/*
 * This method which parses an html file
 * return an array with the words and their number of occurrences
 * ex : [12:[...], 8:[...], ...,1:[...]]
 * with a descending sort
 */
function explode_html($path_file, $text, $separators, $array_stop_words)
{
    $head = get_head($text, $path_file);
    $html = $head;

    $space_separated = implode(' ', $html);
    return explode_text($separators, $array_stop_words, $space_separated);
}

/*
 * This method takes a normal text and return an array of all the words
 * we parse with separators and deleting the empty words
 */
function explode_text($separators, $tab_stop_words, $text)
{
    $text = strtolower($text);
    $tok = strtok($text, $separators);
    $tab_words = [];
    if (strlen($tok) >= 3 && !in_array($tok, $tab_stop_words)) $tab_words[] = $tok;
    while ($tok !== false) {
        $tok = strtok($separators);
        if (strlen($tok) >= 3 && !in_array($tok, $tab_stop_words)) {
            $tab_words[] = $tok;
        };
    }
    return $tab_words;
}

/*
 * This method collect title and meta information
 */
function get_head($text, $path_file)
{
    $title = get_title($text);
    $metas = get_meta_tags($path_file);
    return [
        $title,
        array_key_exists('description', $metas) ? $metas['description'] : '',
        array_key_exists('keywords', $metas) ? $metas['keywords'] : ''
    ];
}

/*
 * This method get title
 */
function get_title($text)
{
    return preg_match("/<title>(.*?)<\/title>/si", $text, $title) ? $title[1] : "";
}

/*
 * This method retrieve and get the content of given tag in text
 */
function get_with_tag($text, $tag)
{
    preg_match_all("/(<($tag).*>)(.*?)(<\/\\2>)/", $text, $matches, PREG_SET_ORDER);
    $tags = [];
    foreach ($matches as $val) {
        $tags[] = $val[3];
    }
    return $tags;
}

/*
 * This method grouping by key using the number of occurrences
 */
function group_by_count($tab_words)
{
    $tab_selection_words = [];
    foreach ($tab_words as $word => $count) {
        $tab_selection_words[$count][] = $word;
    }
    krsort($tab_selection_words);
    return $tab_selection_words;
}

/*
 * This method get an array of stop words
 */
function get_array_stop_words($path_file_stop_words)
{
    return explode("\n", file_get_contents($path_file_stop_words));
}

/*
 * prints methods
 */
function print_tab_tab($tab_mots)
{
    $style = "style='text-align: left;border:1px solid black'";
    echo "<table $style><thead><tr><th $style>count</th><th $style>words</th></tr></thead>";
    foreach ($tab_mots as $index => $value) {
        echo "<tr><td $style>$index</td><td $style>|";
        foreach ($value as $index1 => $word) {
            echo "$word|";
        }
        echo "</td></tr>";
    }
    echo "</table>";
}

function print_tab($text)
{
    foreach ($text as $index => $value) {
        echo "$index: $value<br/>";
    }
}

function print_debug($html_file_path, $tab_words)
{
    $length = count($tab_words);
    echo "<strong>$html_file_path</strong> : <strong>$length</strong><br/><br/>";
    $group_by = group_by_count($tab_words);
    print_tab($tab_words);
    print_tab_tab($group_by);
    echo '<hr>';
}

?>