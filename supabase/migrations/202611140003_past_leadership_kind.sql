-- Add the Past leadership section to the website content editor (About page, under the current executive).
-- Safe after 202610290001_editable_rosters.sql and safe to run twice.
-- The built-in list stays on the public site until an admin uses "Import current ..." in the new section.

alter table public.site_content drop constraint if exists site_content_kind_check;
alter table public.site_content
  add constraint site_content_kind_check
  check (kind in (
    'news', 'photo', 'mwirian', 'archive', 'project', 'leader', 'setting',
    'timeline', 'about', 'product', 'membership_plan', 'cohort',
    'life_member', 'headmaster', 'past_leader'
  ));
