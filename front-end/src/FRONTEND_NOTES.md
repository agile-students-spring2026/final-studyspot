# StudySpot Frontend — Setup Notes

## One-time install

The pages use `react-router-dom` for navigation. After pulling this branch, run:

```bash
cd front-end
npm install react-router-dom
```

That's the only new dependency added.

## How to add your page

1. Create `src/pages/YourPage.js`
2. Style it with a `src/pages/YourPage.module.css` (CSS Modules)
3. Use the design tokens from `src/styles/globals.css` via `var(--color-accent)` etc.
4. Reuse `<Button>` and `<Input>` from `src/components/` if helpful
5. Open `src/App.js` and add your import + `<Route>` — comments guide you

## Pages built 

| Route               | Component            |
|---------------------|----------------------|
| `/login`            | LoginPage            |
| `/signup`           | SignUpPage           |
| `/verify-email`     | VerifyEmailPage      |
| `/choose-password`  | ChoosePasswordPage   |
| `/spots/:id`        | SpotDetailsPage      |

