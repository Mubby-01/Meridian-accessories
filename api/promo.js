// GET /api/promo?code=XYZ → { code, percent } if the code is active, otherwise 404
import { route, send, requireConfig, db } from "./_lib.js";

export default route(["GET"], async (req, res) => {
  requireConfig("SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY");
  const code = String(
    new URL(req.url, "http://x").searchParams.get("code") || "",
  )
    .trim()
    .toUpperCase()
    .slice(0, 40);
  if (!code) return send(res, 400, { error: "Enter a code" });
  const [p] = await db(
    `promo_codes?code=eq.${encodeURIComponent(code)}&active=is.true&select=code,percent`,
  );
  if (!p) return send(res, 404, { error: "Invalid code" });
  send(res, 200, { code: p.code, percent: Number(p.percent) });
});
