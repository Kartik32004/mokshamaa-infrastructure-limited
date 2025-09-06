-- Create inquiries table for storing customer inquiries
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Location Details
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT,
  
  -- Service Details
  category TEXT NOT NULL CHECK (category IN ('Religious', 'Residential', 'Commercial', 'Education', 'Medical', 'Social')),
  subcategory TEXT,
  budget_range TEXT,
  timeline TEXT,
  
  -- Requirements
  description TEXT NOT NULL,
  special_requirements TEXT,
  
  -- Status and Admin
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to TEXT,
  admin_notes TEXT,
  
  -- Documents (JSON array of file URLs)
  documents JSONB DEFAULT '[]'::jsonb
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_category ON public.inquiries(category);
CREATE INDEX IF NOT EXISTS idx_inquiries_state_city ON public.inquiries(state, city);
CREATE INDEX IF NOT EXISTS idx_inquiries_priority ON public.inquiries(priority);

-- Enable Row Level Security
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a business inquiry system)
-- Allow anyone to insert inquiries (public form submissions)
CREATE POLICY "Allow public inquiry submissions" ON public.inquiries
  FOR INSERT WITH CHECK (true);

-- Allow reading inquiries (for admin dashboard - we'll add auth later if needed)
CREATE POLICY "Allow reading inquiries" ON public.inquiries
  FOR SELECT USING (true);

-- Allow updating inquiries (for admin status updates)
CREATE POLICY "Allow updating inquiries" ON public.inquiries
  FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_inquiries_updated_at 
    BEFORE UPDATE ON public.inquiries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
