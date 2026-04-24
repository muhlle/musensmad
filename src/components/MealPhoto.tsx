import { useMealPhoto } from "@/lib/photos";

interface MealPhotoProps {
  value: string | null | undefined;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  loading?: "lazy" | "eager";
}

/**
 * Renders a meal photo from a stored `photo_url` value.
 * The bucket is private — this component fetches a signed URL on mount.
 */
export function MealPhoto({ value, alt, className, fallback = null, loading }: MealPhotoProps) {
  const url = useMealPhoto(value ?? null);
  if (!value) return <>{fallback}</>;
  if (!url) {
    // While the signed URL resolves, render an empty placeholder element with the same shape.
    return <div className={className} aria-hidden />;
  }
  return <img src={url} alt={alt} className={className} loading={loading} />;
}
