// ============================================================
//  CONFIG - paste YOUR Supabase values here (Phase 4)
//  Supabase Dashboard -> Project Settings -> API
// ============================================================

const SUPABASE_URL = "https://dandbiyrxzueklinbhou.supabase.co";      // e.g. https://abcd1234.supabase.co
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbmRiaXlyeHp1ZWtsaW5iaG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NjEzNzgsImV4cCI6MjEwMzQzNzM3OH0.OLjZUdv-8LYySVQxtP9J6GDaC3aXkGRrEnCa35qHVUc";  // the long "anon public" key

// ---- Dropdown options (copied from your options.py) ----
const MODE_OPTIONS = ['Phonecall', 'WhatsApp', 'Direct', 'Referral'];

const DOCTOR_OPTIONS = ['Dr. Krishna', 'Dr. Santhosh', 'Dr. Srinivasalu', 'Dr. Srinivasan',
  'Dr. Divya Murugesan', 'Dr. Renuka', 'Dr. Rajasekar', 'Dr. Jayaganthan', 'Dr. Kailash',
  'Dr. Sathish Kumar', 'Dr. Mathusudhanan', 'Dr. Ashok', 'Dr. Arunprasad', 'Dr. Divya Devi',
  'Dr. Haroon', 'Dr. Pratap Kumar', 'Other'];

const TIMING_OPTIONS = ['NONE', '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM',
  '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM',
  '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
  '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM'];

const STATUS_OPTIONS = ['Cancelled', 'Completed', 'Open', 'Dr & Pt apt Confirmed',
  'Dr Apt Confirmed', 'Pt Apt Confirmed'];

const NURSE_OPTIONS = ['ANU', 'Ajay', 'PRIYA', 'Venkat', 'Chevvanthi', 'Gayathri',
  'Ilavarasi', 'Suseela'];
