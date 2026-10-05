<?php
/**
 * Plugin Name: WEKA Angebot – PDF-Vorlage
 * Description: Legt die WS-Form-PDF-Vorlage für das Angebotsformular an: unverbindliche Preisauskunft
 *              mit Logo, Kontaktdaten, Preistabelle (Variable aus „WEKA Angebot – Preise“) und Freigabefeld.
 *
 * WPCodeBox: PHP, Always, Root.
 * Die Vorlage liegt formularbezogen in uploads/ws-form/pdf/templates/<form_id>.html
 * und wird nur neu geschrieben, wenn sich ihr Inhalt ändert.
 * Benötigt das Snippet „WEKA Angebot – Preise“ (#weka_preisauskunft, #weka_preisauskunft_gueltig_bis).
 */

defined( 'ABSPATH' ) || exit;

defined( 'WEKA_ANGEBOT_FORM_ID' ) || define( 'WEKA_ANGEBOT_FORM_ID', 31 );
define( 'WEKA_ANGEBOT_LOGO_ID', 2362 );          // Mediathek: WEKA-Logo4c.png

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

	// Feste Farbwerte: dompdf kennt keine ACSS-Variablen (#003580 = Überschriftenfarbe des Projekts)
	return '<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<style>
@page { margin: 16mm 16mm 22mm 16mm; }
body { font-family: "DejaVu Sans", sans-serif; font-size: 9pt; color: #1a1a1a; line-height: 1.45; }
.kopf { width: 100%; border-bottom: 2px solid #003580; padding-bottom: 4mm; margin-bottom: 5mm; }
.kopf td { vertical-align: middle; }
.kopf__logo { width: 18mm; }
.kopf__titel { text-align: right; font-size: 16pt; color: #003580; font-weight: bold; }
.kopf__unter { text-align: right; font-size: 9pt; color: #555; }
.daten { width: 100%; border-collapse: collapse; margin-bottom: 5mm; }
.daten th { text-align: left; width: 40mm; padding: 0.5mm 0; color: #555; font-weight: normal; }
.daten td { padding: 0.5mm 0; }
h2 { font-size: 11pt; color: #003580; margin: 0 0 2mm; }
.preise { width: 100%; border-collapse: collapse; margin-bottom: 4mm; }
.preise th { background: #003580; color: #fff; font-weight: bold; text-align: right; padding: 1.5mm 2mm; }
.preise td { border-bottom: 1px solid #ddd; text-align: right; padding: 1.5mm 2mm; }
.preise .preise__kurs { text-align: left; }
.summen { width: 75mm; margin-left: auto; border-collapse: collapse; margin-bottom: 4mm; }
.summen th { text-align: left; font-weight: normal; padding: 1mm 2mm; }
.summen td { text-align: right; padding: 1mm 2mm; }
.summen__brutto th, .summen__brutto td { font-weight: bold; border-top: 1.5px solid #003580; }
.hinweis { font-size: 8pt; color: #555; margin: 0 0 4mm; }
.flatrate { border: 1px solid #ccc; background: #f5f5f5; padding: 3mm; margin-bottom: 5mm; }
.gueltig { margin-bottom: 5mm; }
.freigabe-block { page-break-inside: avoid; }
.freigabe { width: 100%; border-collapse: collapse; page-break-inside: avoid; }
.freigabe td { width: 33%; padding: 9mm 3mm 0 0; }
.freigabe span { display: block; border-top: 1px solid #1a1a1a; padding-top: 1mm; font-size: 8pt; color: #555; }
.fuss { position: fixed; bottom: -14mm; left: 0; right: 0; font-size: 7.5pt; color: #777; text-align: center; }
</style>
</head>
<body>
<div class="fuss">#blog_name · Preisauskunft #field(930) · unverbindlich, kein Angebot im Rechtssinn</div>
<table class="kopf"><tr>
<td>' . ( $logo ? '<img class="kopf__logo" src="' . esc_attr( $logo ) . '" alt="WEKA">' : '#blog_name' ) . '</td>
<td><div class="kopf__titel">Preisauskunft eCampus</div><div class="kopf__unter">unverbindlich · zur internen Freigabe</div></td>
</tr></table>

<table class="daten">
<tr><th>Anfrage-Nr.</th><td>#field(930)</td></tr>
<tr><th>Datum</th><td>#blog_date_custom("d.m.Y")</td></tr>
<tr><th>Firma</th><td>#field(925)</td></tr>
<tr><th>Ansprechpartner</th><td>#field(918) #field(919)</td></tr>
<tr><th>E-Mail</th><td>#field(920)</td></tr>
<tr><th>Telefon</th><td>#field(921)</td></tr>
</table>

<h2>Ausgewählte Kurse und Preise</h2>
#weka_preisauskunft

<p class="gueltig">Diese Preisauskunft ist unverbindlich und gültig bis <strong>#weka_preisauskunft_gueltig_bis</strong>. Alle Preise in Euro. Ihr verbindliches Angebot erhalten Sie gesondert.</p>

<div class="freigabe-block">
<h2>Freigabe</h2>
<table class="freigabe"><tr>
<td><span>Name</span></td>
<td><span>Datum</span></td>
<td><span>Unterschrift</span></td>
</tr></table>
</div>
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
