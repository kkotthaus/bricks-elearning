<?php
/**
 * Plugin Name: WEKA Angebot – Preise
 * Description: Preise und Mengenrabatte des Angebotskonfigurators an einer Stelle. Rechnet die Preisauskunft
 *              serverseitig aus dem WS-Form-Feld auswahl_json und stellt sie dem PDF als Variablen bereit:
 *              #weka_preisauskunft (Tabelle mit Summen und Flatrate-Vergleich), #weka_preisauskunft_gueltig_bis.
 *              Gibt die Preise außerdem auf der Konfigurator-Seite als window.wekaPreise aus.
 *
 * WPCodeBox: PHP, Always, Root.
 */

defined( 'ABSPATH' ) || exit;

defined( 'WEKA_ANGEBOT_FORM_ID' ) || define( 'WEKA_ANGEBOT_FORM_ID', 31 );
define( 'WEKA_ANGEBOT_SEITE_ID', 10801 );   // Seite „Angebotskonfigurator“
define( 'WEKA_ANGEBOT_FELD_JSON', 926 );    // WS-Form-Feld „auswahl_json“

/* Preise in Cent, Rabatte in Prozent – hier ändern, gilt für Seite und PDF. */
function weka_preise_config() {
	return array(
		'listenpreis'  => 5900,  // Einzelkurs netto
		'mwst'         => 19,
		'laufzeit'     => 90,    // Tage je Einzelkurs
		'flatrate'     => 19900, // je Mitarbeitendem und Jahr, netto
		'gueltig_tage' => 30,    // Gültigkeit der Preisauskunft
		// ab Teilnehmenden je Kurs => Rabatt in Prozent (absteigend)
		'rabatte'      => array( array( 50, 40 ), array( 30, 35 ), array( 20, 20 ), array( 10, 10 ), array( 5, 5 ) ),
	);
}

function weka_preise_rabatt( $teilnehmer ) {
	foreach ( weka_preise_config()['rabatte'] as $stufe ) {
		if ( $teilnehmer >= $stufe[0] ) {
			return $stufe[1];
		}
	}
	return 0;
}

function weka_preise_euro( $cent ) {
	return number_format( $cent / 100, 2, ',', '.' ) . ' €';
}

/* Erwartet die Kurse aus auswahl_json: [{id, titel, teilnehmer}, …] */
function weka_preise_berechnen( $kurse ) {
	$cfg    = weka_preise_config();
	$zeilen = array();
	$netto  = 0;
	$max    = 0;

	foreach ( (array) $kurse as $k ) {
		$k          = (array) $k;
		$teilnehmer = max( 1, min( 99999, (int) ( $k['teilnehmer'] ?? 0 ) ) );
		$id         = (int) ( $k['id'] ?? 0 );
		// Titel vom Server, damit im PDF nur echte Kurse stehen
		$titel = ( $id && get_post( $id ) ) ? get_the_title( $id ) : sanitize_text_field( $k['titel'] ?? '' );
		if ( '' === $titel ) {
			continue;
		}
		$rabatt  = weka_preise_rabatt( $teilnehmer );
		$einzel  = (int) round( $cfg['listenpreis'] * ( 100 - $rabatt ) / 100 );
		$summe   = $einzel * $teilnehmer;
		$netto  += $summe;
		$max     = max( $max, $teilnehmer );
		$zeilen[] = compact( 'titel', 'teilnehmer', 'rabatt', 'einzel', 'summe' );
	}

	$mwst = (int) round( $netto * $cfg['mwst'] / 100 );

	return array(
		'zeilen'       => $zeilen,
		'netto'        => $netto,
		'mwst'         => $mwst,
		'brutto'       => $netto + $mwst,
		'flatrate_tn'  => $max,
		'flatrate'     => $max * $cfg['flatrate'],
	);
}

function weka_preise_html( $p ) {
	$cfg = weka_preise_config();
	$e   = 'esc_html';

	if ( ! $p['zeilen'] ) {
		return '<p>Keine Kurse ausgewählt.</p>';
	}

	$h  = '<table class="preise"><thead><tr><th class="preise__kurs">Kurs</th><th>Teilnehmende</th><th>Listenpreis</th><th>Rabatt</th><th>Preis je TN</th><th>Summe netto</th></tr></thead><tbody>';
	foreach ( $p['zeilen'] as $z ) {
		$h .= '<tr><td class="preise__kurs">' . $e( $z['titel'] ) . '</td>'
			. '<td>' . number_format( $z['teilnehmer'], 0, ',', '.' ) . '</td>'
			. '<td>' . weka_preise_euro( $cfg['listenpreis'] ) . '</td>'
			. '<td>' . ( $z['rabatt'] ? $z['rabatt'] . ' %' : '–' ) . '</td>'
			. '<td>' . weka_preise_euro( $z['einzel'] ) . '</td>'
			. '<td>' . weka_preise_euro( $z['summe'] ) . '</td></tr>';
	}
	$h .= '</tbody></table>';

	$h .= '<table class="summen">'
		. '<tr><th>Summe netto</th><td>' . weka_preise_euro( $p['netto'] ) . '</td></tr>'
		. '<tr><th>zzgl. ' . (int) $cfg['mwst'] . ' % MwSt.</th><td>' . weka_preise_euro( $p['mwst'] ) . '</td></tr>'
		. '<tr class="summen__brutto"><th>Gesamt brutto</th><td>' . weka_preise_euro( $p['brutto'] ) . '</td></tr>'
		. '</table>';

	$h .= '<p class="hinweis">Laufzeit je Einzelkurs: ' . (int) $cfg['laufzeit'] . ' Tage. Der Mengenrabatt richtet sich nach der Zahl der Teilnehmenden je Kurs: '
		. implode( ', ', array_map( function ( $s ) { return 'ab ' . $s[0] . ' TN ' . $s[1] . ' %'; }, array_reverse( $cfg['rabatte'] ) ) ) . '.</p>';

	// Flatrate-Vergleich: angenommen wird die größte Teilnehmerzahl eines Kurses als Zahl der Mitarbeitenden
	$guenstiger = $p['flatrate'] < $p['netto'];
	$h .= '<div class="flatrate"><strong>Zum Vergleich: eCampus-Flatrate</strong><br>'
		. 'Alle Kurse für ' . number_format( $p['flatrate_tn'], 0, ',', '.' ) . ' Mitarbeitende, 12 Monate: '
		. number_format( $p['flatrate_tn'], 0, ',', '.' ) . ' × ' . weka_preise_euro( $cfg['flatrate'] ) . ' = <strong>' . weka_preise_euro( $p['flatrate'] ) . '</strong> netto im Jahr.<br>'
		. ( $guenstiger
			? 'Für Ihre Auswahl ist die Flatrate günstiger als die Einzelkurse.'
			: 'Für Ihre Auswahl sind die Einzelkurse günstiger als die Flatrate.' )
		. ' Grundlage ist die größte Teilnehmerzahl eines Kurses; die tatsächliche Zahl der Personen kann abweichen.</div>';

	return $h;
}

function weka_preise_aus_submit( $submit ) {
	$key  = WS_FORM_FIELD_PREFIX . WEKA_ANGEBOT_FELD_JSON;
	$meta = isset( $submit->meta[ $key ] ) ? $submit->meta[ $key ] : '';
	$json = is_array( $meta ) ? ( $meta['value'] ?? '' ) : (string) $meta;
	$daten = json_decode( (string) $json, true );
	return weka_preise_berechnen( is_array( $daten ) ? ( $daten['kurse'] ?? array() ) : array() );
}

/* WS Form: Variablen für die PDF-Vorlage */
add_filter( 'wsf_parse_variables', function ( $variables, $parse_string, $form, $submit ) {
	if ( false === strpos( (string) $parse_string, '#weka_preisauskunft' ) ) {
		return $variables;
	}
	if ( ! $form || (int) $form->id !== (int) WEKA_ANGEBOT_FORM_ID || ! $submit || ! isset( $submit->meta ) ) {
		return $variables;
	}
	$variables['weka_preisauskunft']           = weka_preise_html( weka_preise_aus_submit( $submit ) );
	$variables['weka_preisauskunft_gueltig_bis'] = wp_date( 'd.m.Y', time() + weka_preise_config()['gueltig_tage'] * DAY_IN_SECONDS );
	return $variables;
}, 10, 4 );

/* Konfigurator-Seite: dieselben Werte für die Anzeige im Browser */
add_action( 'wp_head', function () {
	if ( ! is_page( WEKA_ANGEBOT_SEITE_ID ) ) {
		return;
	}
	echo '<script>window.wekaPreise = ' . wp_json_encode( weka_preise_config() ) . ';</script>' . "\n";
} );
