-- Refine the existing Rodney leadership profile in the CMS, if leaders are database-managed.
-- The built-in src/data/content.js profile is updated as well for installations using bundled content.
update public.site_content c
set live = case when c.live is not null then
      jsonb_set(
        jsonb_set(
          jsonb_set(c.live, '{name}', to_jsonb('Henry Mugisha Rodney'::text), true),
          '{houses}', to_jsonb(array['Coates']::text[]), true),
        '{bio}', to_jsonb(array[
          'Henry Mugisha Rodney is a banker and insurer by profession, and a risk adviser, digital strategist and brand influencer. He has played an active role in the Mwiri community and MOBA for many years.',
          'In 2011, Rodney served as Chief Mobiliser for the Old Boys’ Mwiri 100 celebrations. He later chaired Mwiri Cricket Club during its time in the national league from 2011 to 2016. As team manager, he helped Busoga College Mwiri win ten National Cricket Week trophies. The Uganda Cricket Association named him Manager of the Year in 2014 and runner-up in 2015.',
          'Rodney has served as MOBA Publicity Secretary since 2014. He has also worked with the executive and the Mwiri brotherhood on a range of initiatives, including school projects launched in 2015, the sold-out 2017 Mwiri Endowment Fund Dinner, and the introduction of Mwirian-branded merchandise. In 2017, he and MOBA President Dr Patrick Ibembe invited the Kyabazinga of Busoga to attend a Mwiri homecoming as Chief Guest.',
          'His contributions have included helping secure recognition for Paramount Chief Yosia Nadiope, who established the school, and mobilising support for the Mess Roofing Drive, the MOBA Life Membership campaign and the Mwiri Gate Project in 2024.'
        ]::text[]), true)
    else c.live end,
    draft = case when c.draft is not null then
      jsonb_set(
        jsonb_set(
          jsonb_set(c.draft, '{name}', to_jsonb('Henry Mugisha Rodney'::text), true),
          '{houses}', to_jsonb(array['Coates']::text[]), true),
        '{bio}', to_jsonb(array[
          'Henry Mugisha Rodney is a banker and insurer by profession, and a risk adviser, digital strategist and brand influencer. He has played an active role in the Mwiri community and MOBA for many years.',
          'In 2011, Rodney served as Chief Mobiliser for the Old Boys’ Mwiri 100 celebrations. He later chaired Mwiri Cricket Club during its time in the national league from 2011 to 2016. As team manager, he helped Busoga College Mwiri win ten National Cricket Week trophies. The Uganda Cricket Association named him Manager of the Year in 2014 and runner-up in 2015.',
          'Rodney has served as MOBA Publicity Secretary since 2014. He has also worked with the executive and the Mwiri brotherhood on a range of initiatives, including school projects launched in 2015, the sold-out 2017 Mwiri Endowment Fund Dinner, and the introduction of Mwirian-branded merchandise. In 2017, he and MOBA President Dr Patrick Ibembe invited the Kyabazinga of Busoga to attend a Mwiri homecoming as Chief Guest.',
          'His contributions have included helping secure recognition for Paramount Chief Yosia Nadiope, who established the school, and mobilising support for the Mess Roofing Drive, the MOBA Life Membership campaign and the Mwiri Gate Project in 2024.'
        ]::text[]), true)
    else c.draft end,
    updated_at = now(),
    published_at = case when c.live is not null then now() else c.published_at end
where c.kind = 'leader'
  and (
    c.live->>'name' in ('Rodney Mugisha', 'Henry Mugisha Rodney')
    or c.draft->>'name' in ('Rodney Mugisha', 'Henry Mugisha Rodney')
  );
