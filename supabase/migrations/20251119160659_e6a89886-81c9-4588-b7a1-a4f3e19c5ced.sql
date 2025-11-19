-- Create table for allowed emails
CREATE TABLE public.allowed_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on allowed_emails
ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read allowed emails (needed for validation)
CREATE POLICY "Anyone can read allowed emails"
ON public.allowed_emails
FOR SELECT
USING (true);

-- Insert the 5 authorized emails
INSERT INTO public.allowed_emails (email) VALUES
  ('jorge@intruckscorp.com'),
  ('procesos@intruckscorp.com'),
  ('paula.venegas@intruckscorp.com'),
  ('david@intruckscorp.com'),
  ('it@intruckscorp.com');

-- Create function to check if email is allowed
CREATE OR REPLACE FUNCTION public.is_email_allowed(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.allowed_emails 
    WHERE email = check_email
  );
END;
$$;

-- Create trigger function to validate email on signup
CREATE OR REPLACE FUNCTION public.validate_allowed_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_email_allowed(NEW.email) THEN
    RAISE EXCEPTION 'Este correo no está autorizado. Solo los siguientes correos pueden registrarse: jorge@intruckscorp.com, procesos@intruckscorp.com, paula.venegas@intruckscorp.com, david@intruckscorp.com, it@intruckscorp.com';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS check_allowed_email ON auth.users;
CREATE TRIGGER check_allowed_email
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_allowed_email();