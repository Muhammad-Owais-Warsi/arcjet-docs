import { env } from "$env/dynamic/private";
import arcjet, { fixedWindow } from "@arcjet/sveltekit";
import { error, json } from "@sveltejs/kit";

const aj = arcjet({
  key: env.ARCJET_KEY,
  // Tracking by ip.src is the default if not specified
  //characteristics: ["ip.src"],
  rules: [
    fixedWindow({
      mode: "LIVE",
      window: "1h",
      max: 60,
    }),
  ],
});

export async function GET(event) {
  const decision = await aj.protect(event);

  if (decision.isErrored()) {
    // Fail open by logging the error and continuing
    console.warn("Arcjet error", decision.reason.message);
    // You could also fail closed here for very sensitive routes
    //return error(503, { message: "Service unavailable" });
  }

  if (decision.isDenied()) {
    return error(429, { message: "Too many requests" });
  }

  return json({ message: "Hello world" });
}
