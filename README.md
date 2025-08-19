# OddSox Event Booking Multi-Step Form

A modern and elegant form for booking musical events with the OddSox band, inspired by the style of [theoddsoxinternational.com](https://www.theoddsoxinternational.com/).

## 🚀 Key Features

- **Multi-step form** with 5 well-defined phases
- **Responsive design** and accessible interface
- **Advanced validation** for required fields
- **Google Places integration** for location autocomplete
- **URL parameter pre-filling** system
- **Supabase integration** for data storage
- **GDPR compliance** with privacy and marketing consents
- **Modern UI/UX** with smooth transitions and visual feedback

## 📋 Form Structure

### **Step 1: Event Info**

- Event type (wedding, private event, corporate, other)
- Single date or date range
- Who is booking (direct client or agency)

### **Step 2: Location & Venue**

- Location and address (with Google Places Autocomplete)
- Environment type (indoor/outdoor/mixed)
- Google Maps integration for precise coordinates

### **Step 3: Guest Count**

- Number of guests (predefined categories)
- Required sound system (automatically calculated based on guests and environment)

### **Step 4: Music Details**

- Concert duration (2 sets of 45 min or 3 sets of 30 min)
- Optional extra sets (1x30 min or 2x30 min)
- Custom dress code
- Additional musicians

### **Step 5: Contact & GDPR**

- Contact details (name, email, phone)
- Additional notes
- **Privacy Policy consent** (required)
- **Marketing consent** (optional)

## 🏗️ Project Architecture

```
/odds-ox-form/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx                 # Main component and submission logic
│   ├── main.jsx                # React entry point
│   ├── components/
│   │   ├── Step1EventInfo.jsx      # Step 1: Event information
│   │   ├── Step2LocationVenue.jsx  # Step 2: Location and venue
│   │   ├── Step3Guests.jsx         # Step 3: Guest count
│   │   ├── Step4MusicDetails.jsx   # Step 4: Musical details
│   │   ├── Step5ContactNotes.jsx   # Step 5: Contact and GDPR
│   │   ├── Stepper.jsx             # Progress indicator
│   │   └── ErrorBoundary.jsx       # Error handling
│   ├── styles/
│   │   ├── variables.css        # CSS variables (colors, fonts, spacing)
│   │   └── main.css            # Main styles
│   └── images/
│       ├── band.jpg            # Band image
│       └── ORANGE_HORIZONTAL.png # OddSox logo
├── package.json
├── vite.config.js
├── env.example                 # Environment variables template
└── README.md
```

## ⚙️ Configuration

### 1. Environment Variables

Copy `env.example` to `.env.local` and configure:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google API
VITE_GOOGLE_API_KEY=your-google-api-key-here

# n8n Webhook
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

### 2. Supabase Database

Create a table with the following columns:

```sql
CREATE TABLE n8n_oddsox_leads_form (
  id BIGSERIAL PRIMARY KEY,
  record_id TEXT,
  contact_id TEXT,
  user_type TEXT,
  event_type TEXT,
  date_type TEXT,
  start_date DATE,
  end_date DATE,
  location TEXT,
  indoor_outdoor TEXT,
  guests TEXT,
  dress_code TEXT,
  concert_duration TEXT,
  musicians TEXT[],
  full_name TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  marketing_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Google Places API

For location autocomplete, configure the Google Places API key in the `index.html` file.

### 4. n8n Webhook

Configure your n8n webhook URL to receive form submissions:

```bash
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

**Note**: The n8n webhook is called after successful Supabase submission. If the webhook fails, the form submission is still considered successful (non-blocking).

## 🔗 URL Parameter Pre-filling

The form supports automatic pre-filling through URL parameters:

### Supported Parameters

| Parameter    | Type  | Description             | Example                                                |
| ------------ | ----- | ----------------------- | ------------------------------------------------------ |
| `event_type` | text  | Event type              | `wedding`, `private_event`, `corporate_event`, `other` |
| `location`   | text  | Event location          | `Milan, Italy`                                         |
| `date_type`  | text  | Date type               | `single` or `range`                                    |
| `start_date` | date  | Start date (YYYY-MM-DD) | `2025-07-15`                                           |
| `end_date`   | date  | End date (YYYY-MM-DD)   | `2025-07-16`                                           |
| `full_name`  | text  | Full name               | `John Smith`                                           |
| `email`      | email | Contact email           | `john@example.com`                                     |

### Usage Examples

```bash
# Single event
https://yourdomain.com/form?event_type=wedding&location=Milan&start_date=2025-07-15

# Event with date range
https://yourdomain.com/form?event_type=corporate_event&date_type=range&start_date=2025-08-01&end_date=2025-08-03

# Event type only
https://yourdomain.com/form?event_type=private_event
```

## 🎨 Customization

### Colors and Theme

Modify `src/styles/variables.css`:

```css
:root {
  --odd-sox-orange: #ff6b35;
  --odd-sox-dark: #2c3e50;
  --odd-sox-gray: #6c757d;
  --font-heading: "Your-Font", sans-serif;
  --font-body: "Your-Font", sans-serif;
}
```

### Form Fields

Each step is a separate React component in `src/components/`. Modify fields, validation, and logic according to your needs.

## 🚀 Deployment

### Local Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Hosting

The project is compatible with:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting

## 🔒 Security and Privacy

### GDPR Compliance

- **Privacy Policy** (required) - Consent for data processing
- **Marketing Consent** (optional) - Consent for commercial communications
- Data is only saved after accepting the Privacy Policy

### Validation

- Client-side validation for all required fields
- Data sanitization before submission
- Robust error handling with ErrorBoundary

## 📊 Integration with Other Systems

### n8n Workflow

The form sends data to both Supabase and your n8n webhook. The n8n webhook receives a clean payload with all form data, including the `marketing_consent` field to distinguish who can receive commercial communications.

**Webhook Flow:**

1. Form data is successfully saved to Supabase
2. Complete form data is sent to n8n webhook
3. n8n can process the data for CRM integration, email marketing, etc.
4. Webhook failures don't block form submission (non-blocking)

### CRM/Email Marketing

```javascript
// Example integration with Mailchimp
if (formData.marketing_consent) {
  // Add to marketing list
  mailchimp.addToList(email, "marketing");
} else {
  // Add only to contacts list
  mailchimp.addToList(email, "contacts");
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Form won't submit**: Verify all required fields are filled
2. **Supabase error**: Check environment variables and table permissions
3. **Google Places not working**: Verify API key and authorized domains

### Debug

Enable debug logs in browser console to see submission details.

## 🤝 Contributions

For improvements or bug reports, create an issue or pull request.

## 📄 License

This project is developed for OddSox International.

---

**Version**: 2.0.0  
**Last update**: August 2025  
**Status**: ✅ Complete and functional
