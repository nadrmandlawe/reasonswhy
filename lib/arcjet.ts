import arcjet, { fixedWindow, sensitiveInfo, detectBot } from "@arcjet/next";

export const aj = arcjet({
  key: process.env.ARCJET_KEY as string,
  rules: [
    fixedWindow({
      mode: "LIVE",
      window: "1h",
      max: 10,
    }),
    sensitiveInfo({
      mode: "LIVE",
      deny: ["EMAIL", "PHONE_NUMBER", "IP_ADDRESS", "CREDIT_CARD_NUMBER"], // Block common sensitive information
    }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Allow search engines like Google, Bing, etc.
        "CATEGORY:MONITOR",       // Allow uptime monitoring services
        "CATEGORY:PREVIEW",       // Allow link previews (Slack, Discord, etc.)
      ],
    }),
  ],
}); 