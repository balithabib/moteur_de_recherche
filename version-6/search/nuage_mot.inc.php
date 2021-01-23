<?php
//Fonction pour générer le cloud à partir des données fournies
function generer_nuage($data = array(), $minFontSize = 10, $maxFontSize = 36)
{
    $tab_colors=array("#3087F8", "#7F814E", "#EC1E85","#14E414","#9EA0AB", "#9EA414");
    //$tab_colors = array("#641e16", "#512e5f", "#1b4f72", "#0e6251", "#7e5109", "#6e2c00");

    $minimumCount = min(array_values($data));
    $maximumCount = max(array_values($data));
    $spread = $maximumCount - $minimumCount;
    $cloudHTML = '';
    $cloudTags = array();

    $spread == 0 && $spread = 1;
    //Mélanger un tableau de manière aléatoire
    srand((float)microtime() * 1000000);
    $mots = array_keys($data);
    shuffle($mots);

    foreach ($mots as $tag) {
        $count = $data[$tag];

        //La couleur aléatoire
        $color = rand(0, count($tab_colors) - 1);

        $size = $minFontSize + ($count - $minimumCount)
            * ($maxFontSize - $minFontSize) / $spread;
        $cloudTags[] = '<a style="font-size: ' .
            floor($size) .
            'px' .
            '; color:' .
            $tab_colors[$color] .
            '; " title="Rechercher le tag ' .
            $tag .
            '" href="rechercher.php?q=' .
            urlencode($tag) .
            '">' .
            $tag .
            '</a>';
    }
    return join("\n", $cloudTags) . "\n";
}
?>