import { cookies } from 'next/headers'

export async function getCookieServer(){
  const cookieValue = await cookies();
  const token = cookieValue.get("session")?.value;

  return token || null;
}