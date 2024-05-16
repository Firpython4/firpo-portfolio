import env from "./env";

export function getUrl() {
  return env.NEXT_PUBLIC_URL;
}

export default getUrl;
