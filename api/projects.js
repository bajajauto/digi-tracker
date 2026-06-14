import { Redis } from "@upstash/redis";

// The Upstash-for-Redis Marketplace integration injects KV_REST_API_* env vars.
// We also accept UPSTASH_REDIS_REST_* in case you wired Upstash directly.
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

const KEY = "digitization:projects";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const projects = (await redis.get(KEY)) || [];
      return res.status(200).json({ projects });
    }

    if (req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
      const projects = Array.isArray(body.projects) ? body.projects : [];
      await redis.set(KEY, projects);
      return res.status(200).json({ ok: true, count: projects.length });
    }

    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "method_not_allowed" });
  } catch (e) {
    // No storage connected yet → the frontend falls back to device storage.
    return res.status(500).json({ error: "storage_unconfigured", detail: String((e && e.message) || e) });
  }
}
