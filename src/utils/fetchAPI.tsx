import { getToken } from "./tokenUtils";

const get = (url: string) => {
  return fetch(url).then((res) => res.json());
};

const post = async (
  url: string,
  data: any,
  contentType = "application/json"
) => {
  const _data =
    contentType === "application/json" ? JSON.stringify(data) : data;
  console.log("Posting data: ", url, contentType, _data);
  return fetch(url, {
    method: "POST",
    headers: {
      // Accept: 'application/json',
      "Content-Type": contentType,
    },
    body: _data,
  });
};

const authPost = async (
  url: string,
  data: any,
  contentType = "application/json"
) => {
  const token = await getToken();
  const body: any =
    contentType === "multipart/form-data" ? data : JSON.stringify(data);

  return fetch(url, {
    method: "POST",
    headers: {
      // Accept: 'multipart/form-data',
      Authorization: `Bearer ${token}`,
      "Content-Type": contentType,
    },
    body: body,
  });
};

const authDelete = async (
  url: string,
  data: any,
  contentType = "application/json"
) => {
  const token = await getToken();

  const body: any =
    contentType === "multipart/form-data" ? data : JSON.stringify(data);

  const options: RequestInit = {
    method: "DELETE",
    headers: {
      // Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      "Content-Type": contentType,
    },
    body: body,
  };

  return fetch(url, {
    method: "DELETE",
    headers: {
      // Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      "Content-Type": contentType,
    },
    body: data,
  });
};
const authGet = async (url: string) => {
  const token = await getToken();

  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

const refreshAccessToken = async (url: string) => {
  const token = await getToken(false);

  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: token,
    }),
  });
};

export { post, authPost, refreshAccessToken, authGet, authDelete };
