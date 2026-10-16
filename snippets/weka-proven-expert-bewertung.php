<?php
/**
 * WEKA Proven Expert – Bewertung für Bricks
 *
 * Liest die zwischengespeicherte Antwort der Proven-Expert-API. Die Datei schreibt das
 * Code-Element im Footer-Template (ID 24) in den Webroot; hier wird nur gelesen, kein
 * zweiter API-Abruf.
 *
 * Ausgabe in Bricks: {echo:weka_pe_rating('note')}     → „4,5“ (eine Stelle, kaufmännisch gerundet)
 *                    {echo:weka_pe_rating('wert')}     → „4.5“ (dieselbe Note mit Punkt, für das
 *                                                         BricksExtras-Element Star Rating)
 *                    {echo:weka_pe_rating('anzahl')}   → „20“
 *                    {echo:weka_pe_rating('text')}     → „Sehr gut“
 */

defined( 'ABSPATH' ) || exit;

defined( 'WEKA_PE_CACHE_DATEI' ) || define( 'WEKA_PE_CACHE_DATEI', 'provenexpert_b3adf61f95b12b8bce7c72bd82c7fd14.json' );

if ( ! function_exists( 'weka_pe_rating' ) ) {
	function weka_pe_rating( $was = 'note' ) {
		static $daten = null;

		if ( null === $daten ) {
			$daten = array();
			foreach ( array( ABSPATH, trailingslashit( sys_get_temp_dir() ) ) as $ordner ) {
				$datei = $ordner . WEKA_PE_CACHE_DATEI;
				if ( is_readable( $datei ) ) {
					$json = json_decode( (string) file_get_contents( $datei ), true );
					if ( is_array( $json ) && isset( $json['status'] ) && 'success' === $json['status'] ) {
						$daten = $json;
						break;
					}
				}
			}
		}

		$wert   = isset( $daten['ratingValue'] ) ? (float) $daten['ratingValue'] : 0;
		$anzahl = isset( $daten['reviewCount'] ) ? (int) $daten['reviewCount'] : 0;

		switch ( $was ) {
			case 'wert':
				return number_format( round( $wert, 1, PHP_ROUND_HALF_UP ), 1, '.', '' );
			case 'anzahl':
				return (string) $anzahl;
			case 'text':
				// Stufen wie bei Proven Expert
				if ( $wert >= 4.5 ) {
					return 'Sehr gut';
				}
				if ( $wert >= 3.5 ) {
					return 'Gut';
				}
				return $wert >= 2.5 ? 'Befriedigend' : 'Ausreichend';
			default:
				// Eine Nachkommastelle, ab ,05 aufgerundet (4,54 → 4,5; 4,55 → 4,6)
				return number_format( round( $wert, 1, PHP_ROUND_HALF_UP ), 1, ',', '' );
		}
	}
}

// Priorität 20: ein älteres Snippet setzt die Liste mit Priorität 10 komplett neu
add_filter( 'bricks/code/echo_function_names', function ( $namen ) {
	$namen[] = 'weka_pe_rating';
	return $namen;
}, 20 );

// BricksExtras Star Rating bringt keine deutsche Übersetzung mit: Beschriftung für Screenreader
add_filter( 'gettext_bricksextras', function ( $uebersetzung, $text ) {
	return 'Rating: %1$s out of %2$s stars' === $text ? 'Bewertung: %1$s von %2$s Sternen' : $uebersetzung;
}, 10, 2 );
