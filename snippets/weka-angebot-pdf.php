<?php
/**
 * Plugin Name: WEKA Angebot – PDF-Vorlage
 * Description: Legt die WS-Form-PDF-Vorlage für das Angebotsformular an (Logo, Kontaktdaten, Kursübersicht).
 *
 * WPCodeBox: PHP, Always, Root.
 * Die Vorlage liegt formularbezogen in uploads/ws-form/pdf/templates/<form_id>.html
 * und wird nur neu geschrieben, wenn sich ihr Inhalt ändert.
 */

defined( 'ABSPATH' ) || exit;

define( 'WEKA_ANGEBOT_FORM_ID', 31 );
define( 'WEKA_ANGEBOT_LOGO_ID', 2362 );          // Mediathek: WEKA-Logo4c.png
define( 'WEKA_ANGEBOT_FELD_UEBERSICHT', 943 );   // WS-Form-Feld „kurs_uebersicht“

function weka_angebot_logo_data_uri() {
	$datei = get_attached_file( WEKA_ANGEBOT_LOGO_ID );
	$klein = image_get_intermediate_size( WEKA_ANGEBOT_LOGO_ID, 'thumbnail' );
	if ( $datei && $klein ) {
		$datei = dirname( $datei ) . '/' . $klein['file']; // kleine Fassung hält das PDF schlank
	}
	if ( ! $datei || ! is_readable( $datei ) ) {
		return '';
	}
	$typ = wp_check_filetype( $datei );
	return 'data:' . $typ['type'] . ';base64,' . base64_encode( file_get_contents( $datei ) );
}

function weka_angebot_pdf_vorlage() {
	$logo = weka_angebot_logo_data_uri();
	$u    = WEKA_ANGEBOT_FELD_UEBERSICHT;

	return '<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<style>
@page { margin: 18mm 18mm 22mm 18mm; }
body { font-family: "DejaVu Sans", sans-serif; font-size: 10pt; color: #1a1a1a; line-height: 1.45; }
.kopf { width: 100%; border-bottom: 2px solid #003580; padding-bottom: 8mm; margin-bottom: 8mm; }
.kopf td { vertical-align: middle; }
.kopf__logo { width: 22mm; }
.kopf__titel { text-align: right; font-size: 16pt; color: #003580; font-weight: bold; }
.daten { width: 100%; border-collapse: collapse; margin-bottom: 8mm; }
.daten th { text-align: left; width: 45mm; padding: 1.5mm 0; color: #555; font-weight: normal; }
.daten td { padding: 1.5mm 0; }
h2 { font-size: 12pt; color: #003580; margin: 0 0 3mm; }
.kurse { white-space: pre-line; border: 1px solid #ccc; padding: 4mm; }
.fuss { position: fixed; bottom: -14mm; left: 0; right: 0; font-size: 8pt; color: #777; text-align: center; }
</style>
</head>
<body>
<table class="kopf"><tr>
<td>' . ( $logo ? '<img class="kopf__logo" src="' . esc_attr( $logo ) . '" alt="WEKA">' : '#blog_name' ) . '</td>
<td class="kopf__titel">Ihre eCampus-Angebotsanfrage</td>
</tr></table>

<table class="daten">
<tr><th>Anfrage-Nr.</th><td>#field(930)</td></tr>
<tr><th>Datum</th><td>#blog_date_custom("d.m.Y")</td></tr>
<tr><th>Firma</th><td>#field(925)</td></tr>
<tr><th>Ansprechpartner</th><td>#field(918) #field(919)</td></tr>
<tr><th>E-Mail</th><td>#field(920)</td></tr>
<tr><th>Telefon</th><td>#field(921)</td></tr>
</table>

<h2>Ausgewählte Kurse</h2>
<div class="kurse">' . ( $u ? '#field(' . (int) $u . ')' : '#field(926)' ) . '</div>

<div class="fuss">#blog_name · Diese Übersicht ist kein verbindliches Angebot. Ihr individuelles Angebot erhalten Sie gesondert.</div>
</body>
</html>';
}

add_action( 'admin_init', function () {
	$uploads = wp_upload_dir();
	$ordner  = trailingslashit( $uploads['basedir'] ) . 'ws-form/pdf/templates';
	$datei   = $ordner . '/' . WEKA_ANGEBOT_FORM_ID . '.html';
	$inhalt  = weka_angebot_pdf_vorlage();

	if ( file_exists( $datei ) && md5_file( $datei ) === md5( $inhalt ) ) {
		return;
	}
	wp_mkdir_p( $ordner );
	file_put_contents( $datei, $inhalt );
} );
