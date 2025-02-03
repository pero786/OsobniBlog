import { createClient } from "@supabase/supabase-js";
import Auth from './components/Auth';

const supabase = createClient('https://clzdstlzqppxwqsdoqno.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsemRzdGx6cXBweHdxc2RvcW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NzM0MjQsImV4cCI6MjA1NDE0OTQyNH0.5E-pgBLn_Uqf5YH2_yVGV1Je57z3XwTMk3sXofLexWs');

function App() {
  return (
    <>
      <h1 class="text-3xl font-bold underline">OSOBNI BLOG</h1>
      <div>
      <h1 class="text-3xl font-bold text-center my-4">Osobni blog</h1>
      <Auth />
    </div>
    </>
  );
}

export default App;
