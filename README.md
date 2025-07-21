# OddSox Event Booking Multi-Step Form

This project is a modern, elegant multi-step online form for collecting detailed event booking information for a music band, inspired by the style of [theoddsoxinternational.com](https://www.theoddsoxinternational.com/).

## Features

- Three-step slide-in form: Event Info, Music Preferences, Contact Details
- Clean, accessible HTML, CSS, and React (with separated CSS)
- Google Places Autocomplete for location (with graceful fallback)
- Date and time pickers
- Form validation (required fields, email, date logic)
- Smooth transitions and modern UI
- Submits data to Supabase (placeholder endpoint)
- Future-compatible with Airtable (webhook/API placeholder)

## Structure

```
/odds-ox-form/
  public/
    index.html
  src/
    App.jsx
    components/
      Step1EventInfo.jsx
      Step2MusicDetails.jsx
      Step3ContactNotes.jsx
      Stepper.jsx
    styles/
      variables.css
      main.css
  README.md
```

## How to Use

1. Open `public/index.html` in your browser (for static demo), or run with your preferred React dev server.
2. Configure Supabase endpoint in `src/App.jsx`.
3. To add Airtable integration, see the comment block in `src/App.jsx`.

## Customization

- Update colors, fonts, and spacing in `src/styles/variables.css`.
- Adjust form fields or validation in the respective component files.

---

_For questions or improvements, see code comments throughout the project._
