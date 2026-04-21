-- Enum for FODMAP score
CREATE TYPE public.fodmap_level AS ENUM ('low', 'moderate', 'high', 'unknown');
CREATE TYPE public.symptom_severity AS ENUM ('none', 'mild', 'moderate', 'severe');

-- Meals table
CREATE TABLE public.meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  photo_url TEXT,
  title TEXT NOT NULL DEFAULT 'Untitled meal',
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_summary TEXT,
  fodmap_level public.fodmap_level NOT NULL DEFAULT 'unknown',
  fodmap_score INTEGER,
  possible_triggers JSONB NOT NULL DEFAULT '[]'::jsonb,
  evidence_notes TEXT,
  anecdotal_notes TEXT,
  ai_confidence TEXT,
  meal_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  symptom_severity public.symptom_severity NOT NULL DEFAULT 'none',
  symptom_types JSONB NOT NULL DEFAULT '[]'::jsonb,
  symptom_started_at TIMESTAMPTZ,
  user_notes TEXT,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to bump updated_at and edited_at
CREATE OR REPLACE FUNCTION public.touch_meal_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  IF TG_OP = 'UPDATE' THEN
    NEW.edited_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_touch_meal
BEFORE UPDATE ON public.meals
FOR EACH ROW EXECUTE FUNCTION public.touch_meal_updated_at();

-- Enable RLS — allow anonymous device-local usage for v1 (no auth yet).
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Public access policies (single-user device-local app, no auth in v1).
-- We'll scope by user_id IS NULL OR matching auth.uid() once auth is added.
CREATE POLICY "Anyone can read meals"
  ON public.meals FOR SELECT USING (true);

CREATE POLICY "Anyone can insert meals"
  ON public.meals FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update meals"
  ON public.meals FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete meals"
  ON public.meals FOR DELETE USING (true);

-- Storage bucket for meal photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('meal-photos', 'meal-photos', true);

CREATE POLICY "Public read meal photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'meal-photos');

CREATE POLICY "Anyone can upload meal photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'meal-photos');

CREATE POLICY "Anyone can update meal photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'meal-photos');

CREATE POLICY "Anyone can delete meal photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'meal-photos');
