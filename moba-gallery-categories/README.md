# MOBA gallery categories update

Includes category filter tabs on the public gallery, category-first bulk photo uploads in admin content, category metadata for built-in photos, and a Supabase migration that backfills existing CMS gallery records.

## Apply
1. Apply `supabase/migrations/202610270005_gallery_categories.sql` to your MOBA Supabase project. It adds/backfills a category for existing CMS photos.
2. Copy the included `src` files into the same locations in your project.
3. Deploy the website. In Admin → Content → Gallery photos, enter the category first, select/upload the images, complete each caption, and publish.

The gallery keeps pagination and lightbox previous/next navigation, now scoped to the selected category. `supabase/SETUP.md` has the note for the migration and workflow.
