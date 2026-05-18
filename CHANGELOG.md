# Changelog

All notable changes to this project are documented here. The format is based
on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project
adheres loosely to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Extensible social-media field: `content/site.json` `church.social` is now a
  list of `{ platform, url, label? }` entries instead of a fixed
  `{ facebook, youtube }` object. The CMS exposes a curated select of
  platforms with real lucide brand icons (Facebook, YouTube, Instagram,
  Twitter/X, LinkedIn, Twitch, Podcast) plus an "Other / Website" escape
  hatch with a generic globe icon and a free-text label — so editors can add
  TikTok, Spotify, Bluesky, a Substack, or any other profile without a code
  change. Entries with a blank URL are filtered out at load time and never
  reach a renderer; an empty list hides the social row entirely (no empty
  container, no stray spacing). Duplicate platforms are allowed and both
  render in list order (the `/watch` page's "Subscribe on YouTube" card uses
  the first match). See [lib/social.ts](lib/social.ts).

### Changed
- The `/watch` page's "Subscribe on YouTube" card now renders only when a
  YouTube entry with a URL exists in `church.social`. The "Sermon Podcast"
  card is unchanged and always renders.

### Breaking change for instances on `< this release`
- **`content/site.json` `church.social` shape changed** from a fixed object
  to a list. The runtime loader in [lib/social.ts](lib/social.ts) accepts
  *both* shapes during a transition window so an un-migrated `site.json`
  keeps rendering correctly on the deployed site. However, **TinaCMS will
  not be able to edit `site.json` until the file is converted to the list
  shape**, because the schema now defines `social` as a list.
- **Manual migration for cherry-pick adopters:** when cherry-picking this
  change into a church-instance repo, hand-edit `content/site.json` to
  convert any non-empty social values:
  ```jsonc
  // before
  "social": { "facebook": "https://…", "youtube": "https://…" }
  // after
  "social": [
    { "platform": "facebook", "url": "https://…" },
    { "platform": "youtube",  "url": "https://…" }
  ]
  ```
  Then redeploy so TinaCloud picks up the new schema and re-indexes.

### TODO (next release)
- Remove the legacy-object branch in `normalizeSocial()` in
  [lib/social.ts](lib/social.ts) once all known instances have migrated
  their `content/site.json` to the list shape. The legacy branch is marked
  with a `TODO(next-release)` comment.
