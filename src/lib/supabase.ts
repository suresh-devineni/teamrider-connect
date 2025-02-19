
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tvpahfrkawzkqoyvnaxb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cGFoZnJrYXd6a3FveXZuYXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NDg4OTgsImV4cCI6MjA1NTUyNDg5OH0.D952F6KXDj3aprIhP65eRCMKGXwh7W79SvIx9LgAO1g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
