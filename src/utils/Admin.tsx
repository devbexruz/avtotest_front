// utils/Backend.ts - Yangilangan versiya
const backend_url = import.meta.env.VITE_BACKEND_URL;
class Backend {
  public baseURL: string = backend_url; // O'zgartiring

  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `${token}` }),
    };
  }

  async requestGet<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async requestPost<TRequest, TResponse>(
    url: string,
    data: TRequest
  ): Promise<TResponse> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw errorData || new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async requestPut<TRequest, TResponse>(
    url: string,
    data: TRequest
  ): Promise<TResponse> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }


  async requestDelete<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Agar response body bo'sh bo'lsa
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }
}

export default new Backend();