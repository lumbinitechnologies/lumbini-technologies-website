# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Admin letters (Offer Letter / Agreement)

The Admin Dashboard buttons **Offer Letter** and **Agreement** are implemented in an industry-standard way:
- PDF is generated in a **Supabase Edge Function**
- PDF is uploaded to Supabase Storage bucket **`letters`**
- Intern receives a **secure signed link** via email (optional; requires email provider config)

Setup instructions:
- `supabase/functions/send-letter/README.md`

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
