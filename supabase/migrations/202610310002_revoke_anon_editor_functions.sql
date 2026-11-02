-- MOBA site: stop anonymous visitors from calling the editor sign-in and audit-trail functions.
--
-- Runs AFTER 202610310001_editor_audit_trail.sql. Run it in the Supabase SQL Editor. It is safe to run twice.
--
-- Problem: that migration revoked these functions from PUBLIC only. Supabase also grants EXECUTE on new
-- functions straight to the anon role, which "revoke ... from public" does not remove, so anonymous
-- visitors could still call them through the API (HTTP 200 instead of 401/403).
-- Fix: revoke from anon explicitly and keep EXECUTE for signed-in staff only.
-- (Every function below already refuses callers who are not staff; this removes the door as well as the lock.)

revoke all on function public.moba_session_id()                        from public, anon;
revoke all on function public.moba_current_editor()                    from public, anon;
revoke all on function public.moba_editor_choices()                    from public, anon;
revoke all on function public.moba_start_editing(uuid, text)           from public, anon;
revoke all on function public.moba_stop_editing()                      from public, anon;
revoke all on function public.moba_change_my_pin(text, text)           from public, anon;
revoke all on function public.moba_list_editors()                      from public, anon;
revoke all on function public.moba_add_editor(text, text)              from public, anon;
revoke all on function public.moba_set_editor_active(uuid, boolean)    from public, anon;
revoke all on function public.moba_reset_editor_pin(uuid, text)        from public, anon;
revoke all on function public.moba_restore_content_version(bigint)     from public, anon;
revoke all on function public.moba_audit_row()                         from public, anon, authenticated;

grant execute on function public.moba_session_id()                     to authenticated;
grant execute on function public.moba_current_editor()                 to authenticated;
grant execute on function public.moba_editor_choices()                 to authenticated;
grant execute on function public.moba_start_editing(uuid, text)        to authenticated;
grant execute on function public.moba_stop_editing()                   to authenticated;
grant execute on function public.moba_change_my_pin(text, text)        to authenticated;
grant execute on function public.moba_list_editors()                   to authenticated;
grant execute on function public.moba_add_editor(text, text)           to authenticated;
grant execute on function public.moba_set_editor_active(uuid, boolean) to authenticated;
grant execute on function public.moba_reset_editor_pin(uuid, text)     to authenticated;
grant execute on function public.moba_restore_content_version(bigint)  to authenticated;
