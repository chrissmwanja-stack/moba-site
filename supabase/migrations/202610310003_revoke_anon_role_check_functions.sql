-- MOBA site: close the remaining staff-only functions to anonymous visitors.
--
-- Runs AFTER 202610310002_revoke_anon_editor_functions.sql. Run it in the Supabase SQL Editor. It is safe to run twice.
--
-- Same cause as 202610310002: earlier migrations revoked these functions from PUBLIC only, but Supabase also grants
-- EXECUTE straight to the anon role. They already refuse or return false for visitors; this removes the door as
-- well as the lock.
--
-- Safe for the public site: every row-level-security and storage policy that calls moba_is_admin() or
-- moba_can_edit_content() is "to authenticated", so anonymous requests never evaluate them. Visitors keep
-- site_content_public() and the "public can submit" inserts, which are not touched here.

revoke all on function public.moba_is_admin()                            from public, anon;
revoke all on function public.moba_can_edit_content()                    from public, anon;
revoke all on function public.moba_admin_role()                          from public, anon;
revoke all on function public.moba_publish_content(uuid)                 from public, anon;
revoke all on function public.moba_unpublish_content(uuid)               from public, anon;
revoke all on function public.moba_import_content(text, jsonb, text)     from public, anon;

grant execute on function public.moba_is_admin()                         to authenticated;
grant execute on function public.moba_can_edit_content()                 to authenticated;
grant execute on function public.moba_admin_role()                       to authenticated;
grant execute on function public.moba_publish_content(uuid)              to authenticated;
grant execute on function public.moba_unpublish_content(uuid)            to authenticated;
grant execute on function public.moba_import_content(text, jsonb, text)  to authenticated;
