<?php
/**
 * WEKA Zielgruppe – Unterseiten
 *
 * Die Kurs-Taxonomie „Zielgruppen“ (Meta Box, Slug `zielgruppe`) belegt die Adressen /zielgruppe/<begriff>/.
 * Die Seite „Zielgruppe“ hat Unterseiten (z. B. /zielgruppe/buero-verwaltung/), die WordPress deshalb nicht findet (404).
 * Gibt es eine Unterseite von „Zielgruppe“ mit diesem Namen, wird die Seite gezeigt; sonst bleibt es beim Taxonomie-Archiv.
 *
 * WPCodeBox: PHP, Ausführung „Always“, Einfügepunkt Root.
 */
defined( 'ABSPATH' ) || exit;

add_filter( 'request', function ( $query_vars ) {
	if ( is_admin() || empty( $query_vars['zielgruppe'] ) || ! is_string( $query_vars['zielgruppe'] ) ) {
		return $query_vars;
	}
	// Feeds und Blättern bleiben beim Archiv
	if ( isset( $query_vars['feed'] ) || isset( $query_vars['paged'] ) ) {
		return $query_vars;
	}
	$path = 'zielgruppe/' . sanitize_title( $query_vars['zielgruppe'] );
	$page = get_page_by_path( $path );
	if ( $page instanceof WP_Post && 'page' === $page->post_type ) {
		return array( 'pagename' => $path );
	}
	return $query_vars;
} );
