import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const appOrigin = Deno.env.get("APP_ORIGIN") ?? "";
const inviteRedirectUrl = Deno.env.get("INVITE_REDIRECT_URL") ?? "";

function respond(body: Record<string, string>, status: number, origin: string) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Access-Control-Allow-Origin": origin,
			"Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Content-Type": "application/json",
			"Vary": "Origin"
		}
	});
}

async function isAdminUser(client: ReturnType<typeof createClient>, user: { id: string; app_metadata?: { role?: string; is_admin?: boolean }; user_metadata?: { role?: string; is_admin?: boolean } }) {
	if (user.app_metadata?.role === "admin" || user.app_metadata?.is_admin === true) return true;
	for (const tableName of ["profiles", "user_roles"]) {
		const { data, error } = await client.from(tableName).select("is_admin, role").eq("id", user.id).maybeSingle();
		if (error) {
			if (error.code === "42P01" || error.code === "PGRST116" || error.code === "PGRST205") continue;
			console.warn(`Admin lookup failed for ${tableName}`, error.message);
			continue;
		}
		if (data && (data.is_admin === true || data.role === "admin")) return true;
	}
	return false;
}

Deno.serve(async (request) => {
	const requestOrigin = request.headers.get("origin") ?? "";
	let allowedOrigin = "";
	try {
		allowedOrigin = new URL(appOrigin).origin;
	} catch {
		return new Response("Server configuration error", { status: 500 });
	}
	if (requestOrigin !== allowedOrigin) return respond({ error: "Forbidden" }, 403, allowedOrigin);
	if (request.method === "OPTIONS") return respond({}, 200, allowedOrigin);
	if (request.method !== "POST") return respond({ error: "Method not allowed" }, 405, allowedOrigin);
	if (!supabaseUrl || !anonKey || !serviceRoleKey || !inviteRedirectUrl) return respond({ error: "Server configuration error" }, 500, allowedOrigin);

	const authorization = request.headers.get("authorization") ?? "";
	const [scheme, accessToken] = authorization.split(" ");
	if (scheme !== "Bearer" || !accessToken) return respond({ error: "Unauthorized" }, 401, allowedOrigin);

	const caller = createClient(supabaseUrl, anonKey, {
		auth: { autoRefreshToken: false, persistSession: false },
		global: { headers: { Authorization: authorization } }
	});
	const { data: { user }, error: userError } = await caller.auth.getUser(accessToken);
	if (userError || !user) return respond({ error: "Unauthorized" }, 401, allowedOrigin);
	if (!(await isAdminUser(caller, user))) return respond({ error: "Forbidden" }, 403, allowedOrigin);
	try {
		const encodedClaims = accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
		const claims = JSON.parse(atob(encodedClaims.padEnd(Math.ceil(encodedClaims.length / 4) * 4, "=")));
		if (claims.aal !== "aal2") return respond({ error: "MFA required" }, 403, allowedOrigin);
	} catch {
		return respond({ error: "Unauthorized" }, 401, allowedOrigin);
	}

	let email = "";
	try {
		const body = await request.json();
		email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
	} catch {
		return respond({ error: "Invalid request" }, 400, allowedOrigin);
	}
	if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return respond({ error: "Invalid request" }, 400, allowedOrigin);

	const admin = createClient(supabaseUrl, serviceRoleKey, {
		auth: { autoRefreshToken: false, persistSession: false }
	});
	const redirect = new URL(inviteRedirectUrl);
	redirect.searchParams.set("flow", "invite");
	const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo: redirect.toString() });
	if (inviteError) {
		console.error("User invitation failed", inviteError.message);
		return respond({ error: "Invitation failed" }, 400, allowedOrigin);
	}
	return respond({ invited: "true" }, 200, allowedOrigin);
});