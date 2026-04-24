import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SIGN_TTL = 60 * 60; // 1 hour
const cache = new Map<string, { url: string; expires: number }>();

/**
 * Resolves a stored `photo_url` value to a usable image URL.
 * - Bare storage paths (new format) → short-lived signed URL.
 * - Legacy public URLs (contain "/storage/v1/object/public/meal-photos/")
 *   are converted to signed URLs by extracting the path.
 * - Anything else is returned unchanged (e.g. external URLs).
 */
export async function resolveMealPhoto(value: string | null): Promise<string | null> {
  if (!value) return null;

  let path = value;
  const publicMarker = "/storage/v1/object/public/meal-photos/";
  const idx = value.indexOf(publicMarker);
  if (idx !== -1) {
    path = value.slice(idx + publicMarker.length);
  } else if (/^https?:\/\//i.test(value)) {
    // External or otherwise-signed URL — return as-is.
    return value;
  }

  const cached = cache.get(path);
  if (cached && cached.expires > Date.now() + 60_000) {
    return cached.url;
  }

  const { data, error } = await supabase.storage
    .from("meal-photos")
    .createSignedUrl(path, SIGN_TTL);

  if (error || !data?.signedUrl) {
    console.error("createSignedUrl failed", error);
    return null;
  }
  cache.set(path, { url: data.signedUrl, expires: Date.now() + SIGN_TTL * 1000 });
  return data.signedUrl;
}

/** React hook variant for components. */
export function useMealPhoto(value: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!value) {
      setUrl(null);
      return;
    }
    resolveMealPhoto(value).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [value]);
  return url;
}
