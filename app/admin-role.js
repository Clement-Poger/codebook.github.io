(function (global) {
	function isAdminRoleUser(user) {
		if (!user || typeof user !== "object") return false;
		if (user.app_metadata?.role === "admin" || user.app_metadata?.is_admin === true) return true;
		if (user.user_metadata?.role === "admin" || user.user_metadata?.is_admin === true) return true;
		if (user.is_admin === true || user.role === "admin") return true;
		if (typeof user.admin === "boolean" && user.admin) return true;
		return false;
	}

	async function resolveAdminAccess(supabaseClient, user) {
		if (!supabaseClient || !user) return false;
		if (isAdminRoleUser(user)) {
			user.is_admin = true;
			user.app_metadata = user.app_metadata || {};
			user.app_metadata.role = "admin";
			return true;
		}

		for (const tableName of ["profiles", "user_roles"]) {
			try {
				const { data, error } = await supabaseClient.from(tableName).select("is_admin, role").eq("id", user.id).maybeSingle();
				if (error) {
					if (error.code === "42P01" || error.code === "PGRST116" || error.code === "PGRST205") continue;
					console.warn(`Impossible de vérifier le statut admin dans ${tableName}.`, error);
					continue;
				}
				if (!data) continue;
				if (data.is_admin === true || data.role === "admin") {
					user.is_admin = true;
					user.app_metadata = user.app_metadata || {};
					user.app_metadata.role = "admin";
					return true;
				}
			} catch (error) {
				console.warn(`Le statut admin n’a pas pu être vérifié via ${tableName}.`, error);
			}
		}

		user.is_admin = false;
		user.app_metadata = user.app_metadata || {};
		if (user.app_metadata.role !== "admin") user.app_metadata.role = "authenticated";
		return false;
	}

	const exported = { isAdminRoleUser, resolveAdminAccess };
	global.CodeBookAdmin = exported;
	if (typeof module !== "undefined" && module.exports) {
		module.exports = exported;
	}
})(typeof window !== "undefined" ? window : globalThis);
