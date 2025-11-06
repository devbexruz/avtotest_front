import type { SetStateAction, Dispatch } from "react";

type UserRole = "ADMIN" | "USER" | "GUEST";

interface AuthInfo {
  token: string | null;
}

interface User {
  full_name: string;
  role: UserRole;
}

export class ServerConnection {
  private auth: AuthInfo = { token: null};
  public baseUrl: string;
public user: User = { full_name: "-", role: "GUEST" };
  public setUserState: Dispatch<SetStateAction<User>> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;

    // Get token from localStorage
    this.auth.token = localStorage.getItem("token");

    // Agar token mavjud bo‘lsa profilni olishga harakat qilamiz
    if (this.auth.token) {
      this.getProfile()
        .then((data) => {
          if (data?.full_name) {
            this.user = { full_name: data.full_name, role: data.role };
            if (this.setUserState) this.setUserState(this.user);
          }
        })
        .catch((err) => console.error("Profile fetch error:", err));
    }
  }
  isAdmin(): boolean {
    return this.user.role === "ADMIN";
  }
  getAuthInfo(): AuthInfo {
    return this.auth;
  }

  getUser(): User {
    return this.user;
  }

  // 5 HTTP METHODS

  public async requestPost<T>(url: string, data: unknown): Promise<T> {
    const res = await fetch(this.baseUrl + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.auth.token ?? ""}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  public async requestPut<T>(url: string, data: unknown): Promise<T> {
    const res = await fetch(this.baseUrl + url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.auth.token ?? ""}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  public async requestPatch<T>(url: string, data: unknown): Promise<T> {
    const res = await fetch(this.baseUrl + url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.auth.token ?? ""}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  }

    public async requestDelete<T>(url: string): Promise<T> {
    const res = await fetch(this.baseUrl + url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.auth.token ?? ""}`,
      },
    });
    return res.json();
  }

  public async requestGet<T>(url: string): Promise<T> {
    const res = await fetch(this.baseUrl + url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.auth.token ?? ""}`,
      },
    });
    return res.json();
  }

  // LOCAL CHECK
  checkAuth(): boolean {
    return !!this.auth.token;
  }

  // LOGIN / LOGOUT
  login(username: string, password: string) {
    return this.requestPost<{ token: string }>("/auth/login/", { username, password });
  }

  logout() {
    return this.requestPost<unknown>("/auth/logout/", {});
  }

  // PROFILE
  async getProfile() {
    const res = await this.requestGet<User>("/profile/");
    this.user = {
      full_name: res.full_name,
      role: res.role,
    };
    return res;
  }
}
const backend_url = import.meta.env.VITE_BACKEND_URL;
const server = new ServerConnection(backend_url);
export default server;
