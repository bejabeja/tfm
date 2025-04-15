import * as Sentry from "@sentry/node";
import config from "./config.js";

Sentry.init({
    dsn: config.sentryDsn,
    environment: config.nodeEnv,
});