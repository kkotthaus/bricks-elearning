<?php
/**
 * Plugin Name: WEKA Staging – Mails abfangen
 * Description: Nur Staging. Verschickt keine Mails, sondern legt sie samt Anhängen geschützt ab. Ansicht unter Werkzeuge › Abgefangene Mails.
 *
 * WPCodeBox: PHP, Always, Root. Nicht auf die Live-Seite übernehmen.
 * Wirkt nur auf dem Host WEKA_MAIL_ABFANGEN_HOST.
 */

defined( 'ABSPATH' ) || exit;

define( 'WEKA_MAIL_ABFANGEN_HOST', 'weka-e.kotthaus-bs.de' );
define( 'WEKA_MAIL_ABFANGEN_MAX', 50 ); // ältere Einträge werden entfernt

function weka_mail_abfangen_aktiv() {
	return wp_parse_url( home_url(), PHP_URL_HOST ) === WEKA_MAIL_ABFANGEN_HOST;
}

function weka_mail_abfangen_ordner() {
	$uploads = wp_upload_dir();
	$ordner  = trailingslashit( $uploads['basedir'] ) . 'weka-mail-abfang';
	if ( ! is_dir( $ordner ) ) {
		wp_mkdir_p( $ordner );
		file_put_contents( $ordner . '/.htaccess', "Require all denied\n" );
		file_put_contents( $ordner . '/index.php', "<?php // Stille.\n" );
	}
	return $ordner;
}

add_filter( 'pre_wp_mail', function ( $ergebnis, $atts ) {
	if ( null !== $ergebnis || ! weka_mail_abfangen_aktiv() ) {
		return $ergebnis;
	}

	$ordner  = weka_mail_abfangen_ordner();
	$eintrag = gmdate( 'Ymd-His' ) . '-' . wp_generate_password( 6, false );
	wp_mkdir_p( $ordner . '/' . $eintrag );

	$anhaenge = array();
	foreach ( (array) $atts['attachments'] as $datei ) {
		if ( is_string( $datei ) && is_readable( $datei ) ) {
			$name = sanitize_file_name( basename( $datei ) );
			copy( $datei, $ordner . '/' . $eintrag . '/' . $name );
			$anhaenge[] = $name;
		}
	}

	file_put_contents( $ordner . '/' . $eintrag . '/mail.json', wp_json_encode( array(
		'zeit'     => current_time( 'mysql' ),
		'an'       => $atts['to'],
		'betreff'  => $atts['subject'],
		'header'   => $atts['headers'],
		'nachricht'=> $atts['message'],
		'anhaenge' => $anhaenge,
	), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) );

	// Alte Einträge begrenzen.
	$alle = glob( $ordner . '/*', GLOB_ONLYDIR );
	sort( $alle );
	foreach ( array_slice( $alle, 0, max( 0, count( $alle ) - WEKA_MAIL_ABFANGEN_MAX ) ) as $alt ) {
		array_map( 'unlink', glob( $alt . '/*' ) );
		rmdir( $alt );
	}

	return true; // als „gesendet“ melden, nichts verschicken
}, 10, 2 );

add_action( 'admin_menu', function () {
	if ( ! weka_mail_abfangen_aktiv() ) {
		return;
	}
	add_management_page( 'Abgefangene Mails', 'Abgefangene Mails', 'manage_options', 'weka-mail-abfang', 'weka_mail_abfangen_seite' );
} );

function weka_mail_abfangen_seite() {
	$ordner = weka_mail_abfangen_ordner();
	$alle   = glob( $ordner . '/*', GLOB_ONLYDIR );
	rsort( $alle );

	echo '<div class="wrap"><h1>Abgefangene Mails (Staging)</h1>';
	echo '<p>Auf dieser Seite werden keine Mails verschickt. Die letzten ' . (int) WEKA_MAIL_ABFANGEN_MAX . ' werden hier abgelegt.</p>';
	if ( ! $alle ) {
		echo '<p>Noch keine Mails.</p></div>';
		return;
	}
	echo '<table class="widefat striped"><thead><tr><th>Zeit</th><th>An</th><th>Betreff</th><th>Inhalt</th><th>Anhänge</th></tr></thead><tbody>';
	foreach ( $alle as $pfad ) {
		$id   = basename( $pfad );
		$mail = json_decode( (string) file_get_contents( $pfad . '/mail.json' ), true );
		if ( ! $mail ) {
			continue;
		}
		$link = function ( $datei ) use ( $id ) {
			return wp_nonce_url( admin_url( 'admin-post.php?action=weka_mail_abfang&e=' . rawurlencode( $id ) . '&d=' . rawurlencode( $datei ) ), 'weka_mail_abfang' );
		};
		echo '<tr><td>' . esc_html( $mail['zeit'] ) . '</td>';
		echo '<td>' . esc_html( implode( ', ', (array) $mail['an'] ) ) . '</td>';
		echo '<td>' . esc_html( $mail['betreff'] ) . '</td>';
		echo '<td><a href="' . esc_url( $link( 'mail.json' ) ) . '" target="_blank">ansehen</a></td><td>';
		foreach ( $mail['anhaenge'] as $datei ) {
			echo '<a href="' . esc_url( $link( $datei ) ) . '" target="_blank">' . esc_html( $datei ) . '</a><br>';
		}
		echo '</td></tr>';
	}
	echo '</tbody></table></div>';
}

add_action( 'admin_post_weka_mail_abfang', function () {
	if ( ! current_user_can( 'manage_options' ) || ! weka_mail_abfangen_aktiv() ) {
		wp_die( 'Keine Berechtigung.' );
	}
	check_admin_referer( 'weka_mail_abfang' );

	$eintrag = sanitize_file_name( wp_unslash( $_GET['e'] ?? '' ) );
	$datei   = sanitize_file_name( wp_unslash( $_GET['d'] ?? '' ) );
	$pfad    = weka_mail_abfangen_ordner() . '/' . $eintrag . '/' . $datei;
	if ( ! $eintrag || ! $datei || ! is_file( $pfad ) ) {
		wp_die( 'Nicht gefunden.' );
	}

	if ( 'mail.json' === $datei ) {
		$mail = json_decode( (string) file_get_contents( $pfad ), true );
		header( 'Content-Type: text/html; charset=utf-8' );
		echo '<p><strong>An:</strong> ' . esc_html( implode( ', ', (array) $mail['an'] ) ) . '<br><strong>Betreff:</strong> ' . esc_html( $mail['betreff'] ) . '</p><hr>';
		echo wp_kses_post( $mail['nachricht'] );
		exit;
	}

	$typ = wp_check_filetype( $pfad );
	header( 'Content-Type: ' . ( $typ['type'] ?: 'application/octet-stream' ) );
	header( 'Content-Disposition: inline; filename="' . $datei . '"' );
	readfile( $pfad );
	exit;
} );
