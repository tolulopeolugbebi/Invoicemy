Invoicemy Development Journal
Phase 1: Project Setup
I decided to build a simple invoice generator called Invoicemy for freelancers and small businesses.
The goal is to make it easy for users to create professional invoices by entering their business details, client information and invoice items.
I chose React, TypeScript, Vite and CSS to build the application as a responsive web app.
The initial version focuses on the core invoice creation experience, including adding invoice details, adding invoice items, calculating totals and displaying a live invoice preview.
I used Antigravity to help develop the application from the initial prompt.
After the first version was created, I tested the application and identified several areas that needed improvement. I will document these issues and the solutions as development continues.
Phase 2: During testing, I noticed that Nigerian Naira was missing from the currency selector. I added NGN and the ₦ symbol and tested the currency across the invoice calculations.

Phase 3: During testing, I noticed that the invoice interface included Import and Export buttons alongside the Print / PDF option. These actions were not part of the core functionality required for the application.

I decided to remove the Import and Export buttons and keep only the Print / PDF action. This keeps the invoice actions focused on the main purpose of the application without changing the overall UI design.

Phase 4: During testing, I identified several visual inconsistencies in the invoice layout. The business name appeared too large, the padding around the invoice was inconsistent, and the Subtotal and Payment Instructions were positioned side by side. I refined these areas to improve visual hierarchy and spacing while keeping the existing UI design unchanged.

Phase 5: During testing, I found a TypeScript error caused by an unused invoice prop in the Navbar component. I removed the unused prop and confirmed that the build passed successfully after the fix.

Phase 6: During testing, I noticed that the invoice PDF was downloading as a blank document. I investigated the PDF generation functionality and fixed the issue so the generated PDF now displays the invoice information correctly.

Phase 7: During testing, I noticed that the template options were based on job details rather than different invoice designs. I changed the template selector to provide three visual design options and made sure each option changes the invoice preview.