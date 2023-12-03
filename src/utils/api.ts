import { getValidToken } from "@/utils/auth";

// create methods enum
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  // Add other methods as needed
}

export const getData = async (
  endpoint: string,
  method: HttpMethod = HttpMethod.GET,
  params?: { [key: string]: any },
  body?: { [key: string]: any },
  errorHandler?: (status: number, message: string) => void
): Promise<any> => {
  const access_token = await getValidToken();
  let headers: { [key: string]: any } = {
    Authorization: "Bearer " + access_token,
  };

  if (body) {
    headers = {
      ...headers,
      "Content-Type": "application/json",
    };
  }

  const url = new URL(process.env.API_URL + endpoint);
  if (params) {
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
  }

  const response = await fetch(url.toString(), {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (errorHandler) {
      errorHandler(response.status, response.statusText);
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }

  const data = await response.json();
  return data;
};
