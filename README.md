# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Contact Form Configuration

The contact form uses Web3Forms. To enable it:

1. Create an account / form at https://web3forms.com/ and copy your Access Key.
2. Copy `.env.example` to a new file named `.env` in the project root.
3. Replace `YOUR_REAL_WEB3FORMS_ACCESS_KEY` with the actual key:

```
REACT_APP_WEB3FORMS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

4. Save the file, then restart the dev server (`npm start`) or rebuild (`npm run build`).
5. Submit the form locally to confirm you see `Message sent successfully!`.

If you see `Invalid access key` in the form error detail:
- Make sure the key matches exactly (no spaces, no quotes).
- Regenerate the key in Web3Forms if you think it was exposed, then update `.env` and rebuild.

Security Notes:
- `.env` is git‑ignored; do not commit your real key.
- Anyone inspecting the deployed bundle can still see the key (client-side apps cannot fully hide it). If abuse occurs, rotate the key.

Optional Hardening:
- Add a honeypot field or enable spam protection features in Web3Forms dashboard.
- Add rate limiting / captcha using a different backend if you later introduce a server.

### Spam Protection / Key Rotation

Implemented:
- Honeypot field `botcheck` (hidden). Bots that fill it are treated as silent success and discarded.

To rotate your Web3Forms key (e.g., if exposed):
1. Generate a new key in Web3Forms dashboard.
2. Update `.env` with the new value.
3. Rebuild (`npm run build`) and redeploy.
4. Invalidate the old key in the dashboard (if supported) to prevent abuse.

If spam increases:
- Add simple client-side rate limiting (e.g., block multiple submits inside 30s).
- Add a challenge (math question) stored in component state.
- Move to server-side proxy to hide key.
