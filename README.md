# SecScan — Repository Security Scan Dashboard

A web interface that presents security scan results for GitHub repositories in a clear, filterable way. Built as the final project of my internship.

> Scans are simulated. Results come from prepared sample data; the goal is to model security data correctly and present it clearly, not to build a scanner.

## Screens

| Page | Purpose |
|---|---|
| Repositories | List of monitored repositories with score and finding count |
| New Scan | Form to start a (simulated) scan |
| Scan Detail | Security score, severity breakdown, highest-risk findings |
| Findings | All findings with search, severity filter and sorting |
| Finding Detail | Description, affected code, impact and suggested fix |
| Scan History | Score trend across previous scans |

## Screenshots

![Repositories page](screenshots/repositories-desktop.png)

![Scan detail page](screenshots/scan-detail-desktop.png)

![Mobile view](screenshots/repositories-mobile.png)

![Findings page](screenshots/findings-desktop.png)

## Tech stack

- HTML5 (semantic markup)
- CSS3 (Flexbox, Grid, custom properties, media queries)
- JavaScript — *coming next*
- React — *coming next*

## Running locally

1. Clone the repository
```
   git clone https://github.com/refiazra/repo-security-scan-dashboard.git
```
2. Open the folder in VS Code
3. Right-click `index.html` → **Open with Live Server**

## Accessibility notes

- Every form field has a label
- Keyboard focus is always visible
- Severity is shown with text, not color alone
- No horizontal scrolling on mobile

## Author

Refia Azra Dikyar — iCredible Technologies internship, 2026