type RequestInitExtended = RequestInit & { params?: Record<string, number | Date | string> };

export async function fetchFromService<T>(
  baseUrl: string,
  path: string,
  init?: RequestInitExtended
): Promise<T> {
  const url = new URL(`${baseUrl}${path}`);

  if (init?.params) {
    Object.entries(init.params).forEach(([key, value]) => {
      if (typeof value === 'undefined' || value === null) return;
      url.searchParams.append(key, `${value}`);
    });
  }

  let response = await fetch(url.toString(), {
    ...init,
    headers: {
      ...(init?.headers ?? { 'Content-Type': 'application/json' }),
      // Authorization: `Bearer ${getToken()}`,
    },
  });

  // if (response.status === 401) {
  //   const newToken = await refreshToken();
  //   if (newToken) {
  //     response = await fetch(url.toString(), {
  //       ...init,
  //       headers: {
  //         ...(init?.headers ?? { 'Content-Type': 'application/json' }),
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //     });
  //   }
  // }

  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;

    const errorBody = await response.json();
    if (errorBody?.message) {
      errorMessage = errorBody.message;
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return null as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (null as T);
}
