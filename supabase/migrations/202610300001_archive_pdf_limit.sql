-- Archive PDFs: raise the per-file limit on the public `site-media` bucket from 10 MB to 25 MB so scanned
-- magazines and minute books can be uploaded. Keep in step with MAX_PDF_MB in src/lib/uploadLimits.js.
-- Supabase also has a project-wide upload limit (Storage settings); the lower of the two applies.
-- Safe to run twice.
update storage.buckets
   set file_size_limit = 26214400
 where id = 'site-media';
