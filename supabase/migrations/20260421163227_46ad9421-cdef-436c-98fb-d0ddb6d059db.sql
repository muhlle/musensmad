-- 1. Fix function search_path
CREATE OR REPLACE FUNCTION public.touch_meal_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  IF TG_OP = 'UPDATE' THEN
    NEW.edited_at = now();
  END IF;
  RETURN NEW;
END;
$$;

-- 2. Replace permissive meal policies with user-scoped policies
DROP POLICY IF EXISTS "Anyone can read meals" ON public.meals;
DROP POLICY IF EXISTS "Anyone can insert meals" ON public.meals;
DROP POLICY IF EXISTS "Anyone can update meals" ON public.meals;
DROP POLICY IF EXISTS "Anyone can delete meals" ON public.meals;

ALTER TABLE public.meals ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.meals ALTER COLUMN user_id SET DEFAULT auth.uid();

CREATE POLICY "Users can read own meals"
  ON public.meals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals"
  ON public.meals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
  ON public.meals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
  ON public.meals FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Tighten storage policies — scope to user folder, no listing
DROP POLICY IF EXISTS "Public read meal photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload meal photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update meal photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete meal photos" ON storage.objects;

-- Bucket stays public so <img src="..."> works for known URLs, but no broad SELECT policy means listing won't work.
-- We allow direct path access via public URL (bucket public flag handles that).
-- Owners can still manage their files in their own folder.
CREATE POLICY "Users can read own meal photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'meal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own meal photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'meal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own meal photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'meal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own meal photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'meal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
