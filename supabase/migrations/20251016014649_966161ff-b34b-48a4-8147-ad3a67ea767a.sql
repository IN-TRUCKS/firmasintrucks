-- Create a function to validate email domain for InTrucks Corp employees
CREATE OR REPLACE FUNCTION public.validate_intrucks_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the email ends with @intruckscorp.com
  IF NEW.email NOT LIKE '%@intruckscorp.com' THEN
    RAISE EXCEPTION 'Solo se permiten correos corporativos con dominio @intruckscorp.com';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to validate email on user creation
CREATE TRIGGER validate_email_domain_before_insert
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_intrucks_email();

-- Also validate on email updates
CREATE TRIGGER validate_email_domain_before_update
  BEFORE UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION public.validate_intrucks_email();