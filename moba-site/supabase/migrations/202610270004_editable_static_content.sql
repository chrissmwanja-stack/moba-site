-- Extend the CMS to support content currently hard-coded in content.js.
-- Safe after 202610270003_site_content.sql.
alter table public.site_content drop constraint if exists site_content_kind_check;
alter table public.site_content
  add constraint site_content_kind_check
  check (kind in (
    'news', 'photo', 'mwirian', 'archive', 'project', 'leader', 'setting',
    'timeline', 'about', 'product', 'membership_plan', 'cohort'
  ));
