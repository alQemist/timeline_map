Select datum,
       CONCAT(WEEKOFYEAR(datum),"",YEAR(datum)) tydne_rok,
       kraj_nuts_kod,
       sum(nove_pripady) as count,
       okres_lau_kod,
       okres_nazev
FROM analytics.czech_stats
WHERE okres_nazev != "N/A"
GROUP BY tydne_rok, okres_nazev
ORDER BY DATUM
