# Pluto onboarding prototype

Responsive, accessible Pluto onboarding prototype containing the supplied five-screen flow.

## Interaction

- `Start Building` transitions from the intro into the preference flow.
- Screen 2 supports multiple checkbox selections and preserves its state.
- Continue requires at least one selection and advances directly to Screen 3.
- Screen 3 supports exact amount entry, a tap-to-expand range slider, an investment-date dropdown, and a calculated daily contribution.
- Screen 4 supports back navigation, prototype-only Zerodha/Groww selection, and an animated manual demat-details bottom sheet.
- Screen 5 completes onboarding with an animated investment calendar, streak meter, sequential milestone reveal, and prototype-only dashboard/investment actions.
- The current progress segment is white; completed segments are gold.

## Preview

From this directory, run:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Source assets

- `assets/bg.svg`: supplied radial background
- `assets/pluto-logo.svg`: supplied Pluto logo
- `assets/roman-coin.png`: transparent project asset isolated from the supplied visual reference with the built-in image editing workflow
