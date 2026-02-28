const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
}

/** Parse a Response safely — returns structured error if body is not JSON */
async function safeJson<T>(res: Response): Promise<ApiResponse<T>> {
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
        const text = await res.text().catch(() => "");
        return {
            success: false,
            message: res.ok
                ? "Unexpected response from server."
                : `Server error ${res.status}${res.statusText ? ": " + res.statusText : ""}. ${text.slice(0, 120)}`,
        };
    }
    try {
        const json = await res.json();
        if (!res.ok) {
            const errors = (json as { errors?: Record<string, string[]> }).errors;
            const firstError = errors
                ? Object.values(errors).flat()[0]
                : (json as { message?: string }).message;
            return { success: false, message: firstError ?? `Error ${res.status}` };
        }
        return json as ApiResponse<T>;
    } catch {
        return { success: false, message: "Could not parse server response." };
    }
}

class ApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        if (typeof window !== "undefined") {
            this.token = localStorage.getItem("auth_token");
        }
    }

    setToken(token: string | null) {
        this.token = token;
        if (typeof window !== "undefined") {
            if (token) localStorage.setItem("auth_token", token);
            else localStorage.removeItem("auth_token");
        }
    }

    getToken(): string | null { return this.token; }

    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = { Accept: "application/json" };
        if (this.token) headers["Authorization"] = `Bearer ${this.token}`;
        return headers;
    }

    async get<T>(path: string): Promise<ApiResponse<T>> {
        try {
            const res = await fetch(`${this.baseUrl}${path}`, {
                method: "GET",
                headers: this.getHeaders(),
            });
            return safeJson<T>(res);
        } catch (err) {
            return { success: false, message: `Cannot reach server. Check your connection. (${(err as Error).message})` };
        }
    }

    async post<T>(path: string, body?: Record<string, unknown>): Promise<ApiResponse<T>> {
        try {
            const res = await fetch(`${this.baseUrl}${path}`, {
                method: "POST",
                headers: { ...this.getHeaders(), "Content-Type": "application/json" },
                body: body ? JSON.stringify(body) : undefined,
            });
            return safeJson<T>(res);
        } catch (err) {
            return { success: false, message: `Cannot reach server. (${(err as Error).message})` };
        }
    }

    async uploadFile<T>(path: string, formData: FormData): Promise<ApiResponse<T>> {
        try {
            const res = await fetch(`${this.baseUrl}${path}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
                },
                body: formData,
            });
            return safeJson<T>(res);
        } catch (err) {
            return { success: false, message: `Cannot reach server. Check your connection. (${(err as Error).message})` };
        }
    }

    // ── Auth ──
    async register(name: string, email: string, password: string, passwordConfirmation: string) {
        const res = await this.post("/api/v1/auth/register", {
            name, email, password, password_confirmation: passwordConfirmation,
        });
        if (res.success && (res.data as { token?: string })?.token) {
            this.setToken((res.data as { token: string }).token);
        }
        return res;
    }

    async login(email: string, password: string) {
        const res = await this.post("/api/v1/auth/login", { email, password });
        if (res.success && (res.data as { token?: string })?.token) {
            this.setToken((res.data as { token: string }).token);
        }
        return res;
    }

    async logout() {
        const res = await this.post("/api/v1/auth/logout");
        this.setToken(null);
        return res;
    }

    async getUser() { return this.get("/api/v1/auth/user"); }

    // ── Conversions ──
    async getStatus(id: number) { return this.get(`/api/v1/conversions/${id}/status`); }
    async getHistory(page = 1) { return this.get(`/api/v1/conversions?page=${page}`); }

    getDownloadUrl(id: number): string {
        return `${this.baseUrl}/api/v1/download/${id}`;
    }

    // ── Tools ──
    async getTools() { return this.get("/api/v1/tools"); }
}

export const api = new ApiClient(API_BASE);
