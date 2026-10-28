-- Add voting rights to the built-in annual/life plans and to existing CMS-managed plans.
update public.site_content c
set live = case
      when c.live is not null
       and c.live->>'id' in ('annual', 'life')
       and not (coalesce(c.live->'perks', '[]'::jsonb) ? 'Voting rights at MOBA general meetings')
        then jsonb_set(c.live, '{perks}', coalesce(c.live->'perks', '[]'::jsonb) || jsonb_build_array('Voting rights at MOBA general meetings'), true)
      else c.live
    end,
    draft = case
      when c.draft is not null
       and c.draft->>'id' in ('annual', 'life')
       and not (coalesce(c.draft->'perks', '[]'::jsonb) ? 'Voting rights at MOBA general meetings')
        then jsonb_set(c.draft, '{perks}', coalesce(c.draft->'perks', '[]'::jsonb) || jsonb_build_array('Voting rights at MOBA general meetings'), true)
      else c.draft
    end,
    updated_at = now()
where c.kind = 'membership_plan'
  and (
    c.live->>'id' in ('annual', 'life')
    or c.draft->>'id' in ('annual', 'life')
  );
