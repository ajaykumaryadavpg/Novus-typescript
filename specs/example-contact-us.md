# 3Pillar Global — Contact Us

## Application Overview

The 3Pillar Global website (https://www.3pillarglobal.com) has a Contact page with a "Let's Talk" form inside a HubSpot iframe. Prospective clients use this form to inquire about services.

## Test Scenarios

### 1. Client Fills Out Contact Form

**Preconditions:** Application is accessible at the configured base URL.

**Steps:**
1. Navigate to the application URL
2. Verify the "Contact" link is visible on the home page
3. Click the "Contact" link to navigate to the contact page
4. Fill in the "First Name" field with "Test"
5. Fill in the "Last Name" field with "User"
6. Fill in the "Company Name" field with "Test Company"
7. Fill in the "Business Email" field with "client@abc.com"
8. Fill in the "Phone Number" field with "1234567890"
9. Fill in the "Job Title" field with "job title"
10. Select "Alabama" from the Location dropdown
11. Fill in the "Message" field with the inquiry text

**Expected Result:** All form fields are populated with the provided data. The form is ready for submission.

**Notes:**
- Form fields are inside a HubSpot iframe — actions must use `.inFrame()` option
- All implementation functions must use `Perform.actions().log("methodName", "description")`
- Selectors are defined in `tests/pages/contact.page.ts`
