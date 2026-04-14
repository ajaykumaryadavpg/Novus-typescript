/**
 * ContactPage — page object for the contact page.
 * Equivalent to Java ContactPage class with inner LetsTalk class.
 *
 * The contact form is inside a HubSpot iframe on the live site.
 */
export const ContactPage = {
  FORM_IFRAME: "#hs-form-iframe-0",
  LetsTalk: {
    FIRST_NAME: 'input[name="firstname"]',
    LAST_NAME: 'input[name="lastname"]',
    COMPANY_NAME: 'input[name="company"]',
    BIZ_EMAIL: 'input[name="email"]',
    BIZ_PHONE: 'input[name="phone"]',
    JOB_TITLE: 'input[name="jobtitle"]',
    LOCATION_DPDWN: 'select[name="state"]',
    MESSAGE: 'textarea[name="message"]',
    LETS_TALK_BTN: 'input[type="submit"]',
  },
} as const;
