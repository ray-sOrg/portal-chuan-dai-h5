"use server";
import { cookies } from "next/headers";

export const getCookieByKey = async (key: string) => {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(key);
  return cookieValue ? cookieValue.value : null;
};

export const setCookieByKey = async (key: string, value: string) => {
  const cookieStore = await cookies();
  cookieStore.set(key, value);
};

export const deleteCookieByKey = async (key: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(key);
};
export const getAllCookies = async () => {
  const cookieStore = await cookies();
  return cookieStore.getAll();
};
