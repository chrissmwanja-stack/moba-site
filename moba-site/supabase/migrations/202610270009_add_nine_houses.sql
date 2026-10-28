-- Keep the nine confirmed houses aligned between the member form and the approval workflow.
-- Wako was the previous spelling in MOBA's data; migrate it to the confirmed spelling Waako.
insert into public.moba_houses (name, code) values
  ('Hannington', 'HAN'),
  ('Nabikamba',  'NAB'),
  ('Nadiope',    'NAD'),
  ('Willis',     'WLS'),
  ('Wilson',     'WIL'),
  ('Waako',      'WAA'),
  ('Presidents', 'PRE'),
  ('Coates',     'COA'),
  ('Brewer',     'BRE')
on conflict (name) do nothing;

-- Ensure a pre-existing Waako row uses its new code, and preserve existing members while renaming the old spelling.
update public.moba_houses set code = 'WAA' where name = 'Waako' and code <> 'WAA';
update public.members set house = 'Waako' where house = 'Wako';
delete from public.moba_houses where name = 'Wako';

-- Update database-managed leadership cards to use the canonical house spelling too.
update public.site_content c
set live = case when c.live->'houses' ? 'Wako' then
      jsonb_set(c.live, '{houses}', (
        select coalesce(jsonb_agg(case when h = 'Wako' then to_jsonb('Waako'::text) else to_jsonb(h) end), '[]'::jsonb)
        from jsonb_array_elements_text(c.live->'houses') as house_values(h)
      ), true)
    else c.live end,
    draft = case when c.draft->'houses' ? 'Wako' then
      jsonb_set(c.draft, '{houses}', (
        select coalesce(jsonb_agg(case when h = 'Wako' then to_jsonb('Waako'::text) else to_jsonb(h) end), '[]'::jsonb)
        from jsonb_array_elements_text(c.draft->'houses') as house_values(h)
      ), true)
    else c.draft end,
    updated_at = now()
where c.kind = 'leader'
  and ((c.live->'houses' ? 'Wako') or (c.draft->'houses' ? 'Wako'));
