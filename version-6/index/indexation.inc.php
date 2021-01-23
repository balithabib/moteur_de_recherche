<?php
include 'corpus.inc.php';

# stop words file
$PATH_FILE_STOP_WORDS = 'config/stop_words.txt';

# list of separators
$SEPARATORS = "-\"=_|+^}{:;,!?.'’<>()«» 0123456789&#/[]\n";

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
        $document = index_one_html_file($html_file_path);
        $documents[] = $document;
    }
    return $documents;
}

/*
 * This method index one html file
 * */
function index_one_html_file($html_file_path)
{
    global $ARRAY_STOP_WORDS, $SEPARATORS;

    # read html file
    $text = file_get_contents($html_file_path);
    $text = str_replace("&nbsp;", '', $text);
    $text = str_replace("&ucirc;", 'u', $text);
    $text = str_replace("&eacute;", 'e', $text);
    $text = str_replace("\t", '', $text);
    $text = utf8_encode($text);
    $text = strtolower($text);

    # tokenize html file
    $result = explode_html($html_file_path, $text, $SEPARATORS, $ARRAY_STOP_WORDS);
    return to_document(
        get_title($text),
        $html_file_path,
        get_all_description($html_file_path),
        $result[0],
        $result[1]
    );
}

/*
 * This method create a document object
 * */
function to_document($title, $path, $description, $weights, $total)
{
    $document = (object)[];
    $document->poid = $weights;
    $document->titre = $title;
    $document->path = $path;
    $document->description = $description;
    $document->total = $total;
    return $document;
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
    $tab_word_head = explode_text($separators, $array_stop_words, $head);
    $occurrences_word_head = array_count_values($tab_word_head);

    $body = get_body($text);
    $tab_word_body = explode_text($separators, $array_stop_words, $body);
    $occurrences_word_body = array_count_values($tab_word_body);

    return [calculate_weight($occurrences_word_head, 1.25, $occurrences_word_body), count(explode(' ', $head . $body))];
}

function calculate_weight($occurrences_word_head, $coefficient, $occurrences_word_body)
{
    $weight_word = [];
    foreach ($occurrences_word_head as $word => $value) {
        $weight_word[$word] = $coefficient * $value;
    }

    foreach ($occurrences_word_body as $word => $value) {
        $weight_word[$word] = array_key_exists($word, $weight_word) ? $weight_word[$word] + $value : $value;
    }
    arsort($weight_word);
    return $weight_word;
}

/*
 * This method takes a normal text and return an array of all the words
 * we parse with separators and deleting the empty words
 */
function explode_text($separators, $tab_stop_words, $text)
{
    $text = strtolower($text);
    $tab_words = [];

    $tok = strtok($text, $separators);
    if (validate_word($tok, $tab_stop_words)) {
        $tab_words[] = $tok;
    }

    while ($tok !== false) {
        $tok = strtok($separators);
        if (validate_word($tok, $tab_stop_words)) {
            $tab_words[] = $tok;
        }
    }
    return $tab_words;
}

function validate_word($word, $tab_stop_words)
{
    return strlen($word) > 2 && !in_array($word, $tab_stop_words);
}

/*
 * This method collect title and meta information
 */
function get_head($text, $path_file)
{
    $title = get_title($text);
    $metas = get_meta_tags($path_file);
    return html_entity_decode(utf8_encode(implode(' ', [
        $title,
        get_description($metas),
        get_keywords($metas)
        //get_subject($metas),
        //($metas)
    ])));
}

function get_all_description($path_file)
{
    $metas = get_meta_tags($path_file);
    return html_entity_decode(utf8_encode(implode(' ', [
        get_description($metas)
        //get_keywords($metas)
        //get_subject($metas),
        //get_topic($metas)
    ])));
}

function get_description($metas)
{
    return array_key_exists('description', $metas) ? $metas['description'] : '';
}

function get_keywords($metas)
{
    return array_key_exists('keywords', $metas) ? $metas['keywords'] : '';
}

function get_subject($metas)
{
    return array_key_exists('subject', $metas) ? $metas['subject'] : '';
}

function get_topic($metas)
{
    return array_key_exists('topic', $metas) ? $metas['topic'] : '';
}

/*
 * This method get title
 */
function get_title($text)
{
    return get_tag($text, 'title');
}

function get_tag($text, $tag)
{
    return preg_match(get_complete_pattern($tag), $text, $matches) ? $matches[1] : '';
}

function get_complete_pattern($tag)
{
    return "/<$tag.*?>(.*?)<\/$tag>/is";
}

/*
 * This method collect all the necessary elements of the body
 * return
 */
function get_body($text)
{
    $text_body = get_tag($text, 'body');

    $text_body = strip_scripts($text_body);

    $text_body = strip_tags($text_body);

    return html_entity_decode($text_body);
}

function strip_scripts($text)
{
    return preg_replace(get_complete_pattern('script'), '', $text);
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

function get_top_words($weights, $n)
{
    return implode(', ', array_keys(array_slice($weights, 0, $n)));
}

?>