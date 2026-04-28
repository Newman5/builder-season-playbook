# Rewards

## Reward Pools

The {{season_name}} reward structure is divided into separate pools, referred to as pies.

- Builder Pie: {{builder_prize_pool}} {{reward_currency}}
- {{sponsored_track_name}}: {{sponsored_track_prize_pool}} {{reward_currency}}
- Real User Pie: {{real_user_prize_pool}} {{reward_currency}}
- Feedback Pie: {{feedback_prize_pool}} {{reward_currency}}

Total participant reward pools: _(sum of the above)_

The {{sponsored_track_name}} is sponsored by {{sponsored_track_sponsor}}.

{{#if has_vc_pitch_opportunity}}
Qualified {{sponsored_track_name}} projects also get an opportunity to pitch to {{vc_fund_name}}.
{{/if}}

## Administration

Administration is separate from participant reward pools:

- Administration: {{admin_allocation}} {{reward_currency}}

## Builder Pie

The Builder Pie is split equally among all participants who fully qualify for the Builder track.

Key idea:

- this is an equal split pool
- qualification matters more than ranking

Projects that qualify for the {{sponsored_track_name}} receive a share of that pool instead of the Builder Pie.

## {{sponsored_track_name}}

The {{sponsored_track_name}} is split equally among qualified participants who:

- satisfy every Builder Pie requirement
- meet the {{sponsored_track_name}}-specific requirements

This pie replaces the Builder Pie for teams that qualify.

## Real User Pie

The Real User Pie is split equally among participants who:

- qualify as builders first (through the Builder Pie or {{sponsored_track_name}})
- also meet the Real User requirements

## Feedback Pie

The Feedback Pie is distributed proportionally based on feedback credits.

Rules:

- 1 live, recorded feedback session = 1 credit
- the credit goes to the feedback giver who completes the session
- receiving feedback does not earn a credit by itself
- a participant can earn up to {{max_feedback_credits_per_participant}} credits
- the {{feedback_prize_pool}} {{reward_currency}} pool is divided proportionally across all valid credits

## Feedback Example

If:

- Alice earns 15 credits
- Bill earns 5 credits
- Charles earns 10 credits

Then:

- total credits = 30
- {{feedback_prize_pool}} / 30 = _X {{reward_currency}} per credit_, subject to final rounding decisions

## Important Note

Reward pools are distributed based on qualification and verification, not on subjective judging.
