<?php
function generate_words_cloud($data = array(), $minFontSize = 10, $maxFontSize = 36)
{
    $tab_colors = array("#3087F8", "#7F814E", "#EC1E85", "#14E414", "#9EA0AB", "#9EA414");

    $minimumCount = min(array_values($data));
    $maximumCount = max(array_values($data));
    $spread = $maximumCount - $minimumCount;
    $cloudTags = array();

    $words = array_keys($data);
    shuffle($words);
    foreach ($words as $tag) {
        $count = $data[$tag];

        //La couleur aléatoire
        $color = rand(0, count($tab_colors) - 1);

        $size = $minFontSize + ($count - $minimumCount) * ($maxFontSize - $minFontSize) / $spread;
        $cloudTags[] = '<a style="font-size: '
            . floor($size)
            . 'px'
            . '; color:'
            . $tab_colors[$color]
            . '; " title="Rechercher le tag '
            . $tag
            . '" href="rechercher.php?q='
            . urlencode($tag)
            . '">'
            . $tag . '</a>';
    }
    return join("\n", $cloudTags) . "\n";
}

?>

