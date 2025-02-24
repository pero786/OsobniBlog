import { createSignal } from "solid-js";
import { supabase } from "../services/supabase";
import { useNavigate } from "@solidjs/router";
import { A } from "@solidjs/router";

export default function SignUp() {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email: email(),
      password: password(),
    });
    if (error) {
      console.error('Greška pri registraciji:', error.message);
    } else {
      alert('Provjerite e-mail za potvrdu!');
      navigate('/signin');
    }
  };

  return (
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center mb-6">Registracija</h2>
      <input
        type="email"
        placeholder="E-mail"
        class="input input-bordered w-full mb-4"
        onInput={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Lozinka"
        class="input input-bordered w-full mb-4"
        onInput={(e) => setPassword(e.target.value)}
      />
      <button class="btn btn-primary w-full mb-2" onClick={handleSignUp}>
        Registriraj se
      </button>
      <p class="text-center mt-4">
        Već imate račun?{" "}
        <A href="/signin" class="text-blue-500 hover:underline">
          Prijavite se ovdje
        </A>
      </p>
    </div>
  );
}