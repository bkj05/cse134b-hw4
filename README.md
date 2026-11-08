# CSE134B HW4 — Benjamin Kettor Jr.

A copy of the HW3 personal portfolio with progressively enhanced contact forms,
explicit light/dark themes, and a theme-change view transition. HW2 and HW3
repositories and deployments are unchanged.

## Setup and submission

Repository: https://github.com/bkj05/cse134b-hw4

Deploy this repository as a separate static site. Publish the repository root,
with no build command. Submit the repository URL and the new website URL in
Gradescope. The separate HW4 deployment and final deployed-site checks are
still pending.

## Parts 1 and 2

`form-no-js.html` contains no scripts or inline handlers. Its required name,
email, and comments fields use native browser constraints, associated labels,
autocomplete, and visible instructions. Name length is 1–100; comments length
is 10–1,000, allowing one-character names and enough context for a concise
inquiry. Names have no character-set restriction. Native `:user-invalid`
styling uses dashed borders without changing border widths or shifting content.

Both forms use `method="post"`, `action="https://httpbin.org/post"`, and normal
URL-encoded browser submission. Named controls send `name`, `email`, `comments`,
and `possible_bot=true`. The hidden value demonstrates submission only. These
are public testing forms, not an email or message-storage service.

## Part 3

`form-with-js.html` loads the external deferred `form.js`. The HTML constraints
remain usable if JavaScript fails or is disabled. JS-dependent feedback starts
hidden and appears only after initialization.

After installing its submit listener, the script sets `form.noValidate=true`
in JavaScript only. This allows button and Enter submissions to reach the same
handler instead of being intercepted by native validation before `submit`.
The handler reads `.validity`, clears and sets custom validity messages, and
prevents only invalid submissions. A failed attempt records each invalid field
exactly once. Editing and blur update feedback without adding history entries.
On success, the preserved `form_errors` array is serialized into `form-errors`
and the normal POST proceeds. History contains field identifiers and fixed
messages, never entered contact information.

Errors remain until corrected and have field-specific `aria-describedby`
associations and a polite live region. Only a submit attempt may focus an
invalid field; typing never moves focus. The comments counter uses `maxlength`,
warns at 100 remaining, and treats the limit as information rather than an error.

## Part 4

`assets/theme.js` adds an explicitly selected light/dark preference to the
portfolio pages and enhanced form. The script-free form always uses the
readable default theme and has no theme control. Theme controls start hidden.
Reading and writing `localStorage` are both guarded; applying the theme does
not depend on storage succeeding.

Activating the theme button uses `document.startViewTransition()` when
supported. The underlying theme change also works without the API or if it
throws. Reduced-motion users get an immediate theme change; the CSS also
removes view-transition animations under `prefers-reduced-motion: reduce`.

## Checks completed on the local web preview

- All eight root HTML pages pass the W3C Nu checker with zero errors or warnings.
- Local links, assets, and `aria-describedby` references resolve; JS syntax checks pass.
- Native validation blocks empty fields, `not-an-email`, and a user-typed
  five-character comment. A one-character Chinese name is accepted.
- Keyboard submission posts all four baseline fields successfully to httpbin.
- Three failed enhanced-form attempts (button and Enter) followed by correction
  produce a successful POST containing exactly eight expected history entries.
  Editing, blur, counter checks, and corrections add no duplicate entries.
- Counter checks cover 100 remaining, zero remaining, blocked extra typing at
  the native limit, and deletion back to one remaining.
- Keyboard theme switching works. Dark theme survives reload and navigation
  between the homepage and enhanced form on the same preview origin.
- Both forms fit the available 1363px desktop viewport without horizontal scrolling.
- Isolated JavaScript tests pass for blocked storage reads/writes, saved and
  unrecognized preferences, missing/working/throwing transition APIs, and
  reduced-motion fallback. These are code tests, not browser-emulation claims.

## Checks still required on the deployed site

- Repeat successful baseline and enhanced submissions with sample data.
- Disable JavaScript and verify both forms retain native validation and POST;
  confirm JS-only messages and theme controls remain hidden.
- Check both forms at a narrow width (about 375px) and a desktop width.
- In current desktop Chrome, observe the theme view transition and test reduced
  motion; verify theme persistence on the deployment's own origin.
- Verify keyboard focus and contrast in both themes, including error states.

The original HW3 `part1/` cheese exercise and the existing small experimental
canvas/console scripts are retained from the copied portfolio. They are not
the HW4 forms. There are no frameworks, validation libraries, or new dependencies.
