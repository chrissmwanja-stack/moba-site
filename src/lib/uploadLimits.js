// Largest PDF the admin editor accepts, in megabytes. Keep in step with the `site-media` bucket limit
// (see supabase/migrations/202610300001_archive_pdf_limit.sql). Supabase's own project-wide upload limit
// still applies on top of this, so check Storage settings if a larger file is refused.
export const MAX_PDF_MB = 25
