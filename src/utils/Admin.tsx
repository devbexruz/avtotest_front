// utils/Backend.ts - Yangilangan versiya
const backend_url = import.meta.env.VITE_BACKEND_URL;

class Backend {
  public baseURL: string = backend_url;

  private getAuthHeaders(isMultipart = false) {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};

    // Agar bu fayl yuborish (multipart) bo'lmasa, Content-Type: application/json ni qo'shamiz
    if (!isMultipart) {
      headers["Content-Type"] = "application/json";
    }
    
    // Agar token mavjud bo'lsa, Authorization sarlavhasini qo'shamiz
    if (token) {
      headers.Authorization = `${token}`;
    }

    return headers;
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

  // TRequest - endi JSON ob'ekti YOKI FormData bo'lishi mumkin
  async requestPost<TRequest extends object | FormData, TResponse>(
    url: string,
    data: TRequest,
    headers?: Record<string, string>,
  ): Promise<TResponse> {
    
    // 1. Ma'lumot turini aniqlash
    const isFormData = data instanceof FormData;

    // 2. So'rov tanasini (body) va sarlavhalarini tayyorlash
    let body: BodyInit | null;
    let requestHeaders: Record<string, string>;

    if (isFormData) {
      // Agar FormData bo'lsa, body ni to'g'ridan-to'g'ri ishlatamiz.
      // MUHIM: Content-Type ni getAuthHeaders(true) orqali O'RNATMAYMIZ.
      body = data as FormData;
      requestHeaders = { ...this.getAuthHeaders(true), ...headers };
    } else {
      // Aks holda, JSON sifatida yuboramiz.
      body = JSON.stringify(data);
      requestHeaders = { ...this.getAuthHeaders(false), ...headers };
    }

    const response = await fetch(`${this.baseURL}${url}`, {
      method: "POST",
      headers: requestHeaders,
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw errorData || new Error(`HTTP error! status: ${response.status}`);
    }

    // Serverdan 204 No Content javobi kelganda xato qilmaslik uchun
    if (response.status === 204) {
      return {} as TResponse;
    }

    return response.json();
  }

  // Qolgan funksiyalar o'zgarishsiz qoldi: requestPut, requestDelete
  async requestPut<TRequest, TResponse>(
    url: string,
    data: TRequest
  ): Promise<TResponse> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "PUT",
      headers: this.getAuthHeaders(), // JSON uchun getAuthHeaders() to'g'ri ishlaydi
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

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }
}

export default new Backend();