import { components } from "@/interfaces/db_interfaces";
import { getValidToken } from "@/utils/auth";

// create methods enum
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  // Add other methods as needed
}

export const getUser = async (): Promise<components["schemas"]["Employee"]> => {
  if (sessionStorage.getItem("employee")) {
    return JSON.parse(sessionStorage.getItem("employee")!);
  } else {
    const endpoint = "/user/me";
    const employeeData = await getData(endpoint);
    if (!employeeData) {
      throw new Error("Failed to get user data");
    }
    sessionStorage.setItem("employee", JSON.stringify(employeeData));
    return employeeData;
  }
};

export const getData = async (
  endpoint: string,
  method: HttpMethod = HttpMethod.GET,
  params?: { [key: string]: any },
  body?: { [key: string]: any },
  errorHandler?: (status: number, message: string) => void,
  signal?: AbortSignal // Added signal parameter
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

  const controller = new AbortController();
  const combinedSignal = signal || controller.signal; // Use the provided signal or controller's signal

  try {
    const response = await fetch(url.toString(), {
      method: method,
      headers: headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: combinedSignal, // Use the combined signal
    });

    const data = await response.json();
    if (!response.ok) {
      const detail = data.detail;
      if (detail === undefined) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      if (errorHandler) {
        errorHandler(response.status, detail);
      } else {
        throw new Error(detail);
      }
    }
    return data;
  } catch (error) {
    // Handle network errors or other issues
    console.error("Error fetching data:", (error as Error).message);

    // Rethrow the error if it's not an abort signal
    if ((error as Error).name !== "AbortError") {
      throw error;
    }
  } finally {
    // Cleanup the controller if it's not the provided signal
    if (!signal) {
      controller.abort();
    }
  }
};
