// src/config/supabase.js
import { createClient } from '@supabase/supabase-js';

// GANTI DENGAN KUNCI DAN URL SUPABASE ANDA
const supabaseUrl = 'https://otzpssmrgwkorbqcaxda.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90enBzc21yZ3drb3JicWNheGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNjg3NTUsImV4cCI6MjA3OTk0NDc1NX0.mj3F2QxSnnMLmIkZNccn99R92fctP3ZGg60pCpZFoUg';

// Inisialisasi Klien Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);