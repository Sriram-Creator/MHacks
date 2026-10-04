import "dotenv/config";
import { networkInterfaces } from "node:os";
import express from "express";
import cors from "cors";
import { aiRouter } from "./routes/ai.js";
import { forecastRouter } from "./routes/forecast.js";
import { itemsRouter } from "./routes/items.js";
import { makersRouter } from "./routes/makers.js";
import { meetupSpotsRouter } from "./routes/meetupSpots.js";
import { ordersRouter } from "./routes/orders.js";
import { isMockMode } from "./vision.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;
// Bind to all interfaces so other devices on the same Wi-Fi can reach the API.
const HOST = process.env.HOST || "0.0.0.0";

/** Returns the first non-internal IPv4 address (the LAN IP), if any. */
function getLanAddress(): string | undefined {
  for (const iface of Object.values(networkInterfaces())) {
    for (const net of iface ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return undefined;
}

app.use(cors());
// base64 images are large, so bump the JSON body limit.
app.use(express.json({ limit: "15mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/ai", aiRouter);
app.use("/forecast", forecastRouter);
app.use("/items", itemsRouter);
app.use("/makers", makersRouter);
app.use("/meetup-spots", meetupSpotsRouter);
app.use("/orders", ordersRouter);

app.listen(PORT, HOST, () => {
  const { mock, reason } = isMockMode();
  const lan = getLanAddress();
  console.log(`Server listening on http://${HOST}:${PORT}`);
  console.log(`  local:   http://localhost:${PORT}`);
  if (lan) {
    console.log(`  network: http://${lan}:${PORT}  (use this on other devices)`);
  }
  console.log(
    `[AI] ${mock ? "MOCK" : "LIVE"} mode (${reason}) — POST /ai/listing`,
  );
});
