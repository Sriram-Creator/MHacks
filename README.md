# Savor

Savor is an [Expo](https://expo.dev) mobile marketplace for Michigan cottage food. Buyers build a box from local makers and pick up at a public meetup.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


## Fetch.ai Agent (ASI:One Challenge)

![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3)
![tag:hackathon](https://img.shields.io/badge/hackathon-5F43F1)

Hosted agent code: [`fetch_agent/agent.py`](fetch_agent/agent.py) (Agentverse editor). This is the only agent to use for judging, Devpost, and the ASI:One Submission Agent. Do not use `@cottage-ai`.

- **Agent name:** michigan-cottage-compliance
- **Handle:** `@michigan-cottage-com`
- **Address:** `agent1qfp4fke569p8elfchcezp2asr9zq9vvwcpq89d5nn7yfzatnag3kj3kw5c2`
- **Profile:** https://agentverse.ai/agents/details/agent1qfp4fke569p8elfchcezp2asr9zq9vvwcpq89d5nn7yfzatnag3kj3kw5c2/profile

In ASI:One chat, tag `@michigan-cottage-com` and send:

1. `Can I sell pickles in Michigan?` — legal check (NO)
2. `How much sourdough should I make?` — forecast (`List 40: ...`)
3. `nut-free breakfast box under $30` — mock box order (sourdough, jam, honey, pickup, `ORD-xxxxxx`)

The catalog, prices, allergens, stock, and pickup spots are a hardcoded snapshot. Stock does not decrease, order IDs are random, and nothing is sent to the Savor server. The forecast is a fixed message; the legal check is a keyword list.

If the first message has no reply, send a throwaway warmup message first (cold start). Do not restart or edit the hosted agent before judging.
