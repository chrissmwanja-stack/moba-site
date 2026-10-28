-- Add categories to gallery records that were created before the Gallery category field existed.
-- Existing public content remains published; only missing category values are backfilled.
with photo_categories as (
  select
    id,
    case
      when lower(coalesce(live->>'src', draft->>'src', '')) like '%2026-reunion%'
        or lower(coalesce(live->>'caption', draft->>'caption', '')) like '%reunion%'
        then 'Reunions'
      when lower(coalesce(live->>'src', draft->>'src', '')) like '%agm%'
        or lower(coalesce(live->>'caption', draft->>'caption', '')) like '%agm%'
        then 'AGM & meetings'
      when lower(coalesce(live->>'caption', draft->>'caption', '')) like any (array[
        '%gate%', '%handover%', '%refurb%', '%library%', '%equipment%', '%dispensary%', '%basketball%', '%renovation%'
      ]) then 'Projects & campus'
      else 'Community events'
    end as category
  from public.site_content
  where kind = 'photo'
)
update public.site_content c
set live = case
      when c.live is not null and nullif(btrim(c.live->>'category'), '') is null
        then jsonb_set(c.live, '{category}', to_jsonb(pc.category), true)
      else c.live
    end,
    draft = case
      when c.draft is not null and nullif(btrim(c.draft->>'category'), '') is null
        then jsonb_set(c.draft, '{category}', to_jsonb(pc.category), true)
      else c.draft
    end
from photo_categories pc
where c.id = pc.id
  and (
    (c.live is not null and nullif(btrim(c.live->>'category'), '') is null)
    or (c.draft is not null and nullif(btrim(c.draft->>'category'), '') is null)
  );
