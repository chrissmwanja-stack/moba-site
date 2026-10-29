-- Add the Life members and Headmasters sections to the existing website content editor.
-- Safe after 202610270004_editable_static_content.sql and safe to run twice.
-- Existing names remain on the public site until an admin uses "Import current ..." in each new section.

alter table public.site_content drop constraint if exists site_content_kind_check;
alter table public.site_content
  add constraint site_content_kind_check
  check (kind in (
    'news', 'photo', 'mwirian', 'archive', 'project', 'leader', 'setting',
    'timeline', 'about', 'product', 'membership_plan', 'cohort',
    'life_member', 'headmaster'
  ));
