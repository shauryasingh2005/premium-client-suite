-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    weight NUMERIC,
    height NUMERIC,
    regimen TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access to profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create workouts table
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    regimen TEXT NOT NULL,
    exercises JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on workouts
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own workouts" ON public.workouts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own workouts" ON public.workouts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own workouts" ON public.workouts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own workouts" ON public.workouts
    FOR DELETE USING (auth.uid() = user_id);

-- Create nutrition_plans table
CREATE TABLE IF NOT EXISTS public.nutrition_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    diet_type TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    meal_plan JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on nutrition_plans
ALTER TABLE public.nutrition_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own nutrition plans" ON public.nutrition_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own nutrition plans" ON public.nutrition_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own nutrition plans" ON public.nutrition_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own nutrition plans" ON public.nutrition_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Automatically create profiles when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
