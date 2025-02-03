import { createSignal } from 'solid-js';
import { supabase } from '../supabaseClient';

export default function Auth() {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email(),
      password: password(),
    });
    if (error) console.error('Greška pri prijavi:', error.message);
    else console.log('Uspješno prijavljen!');
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email: email(),
      password: password(),
    });
    if (error) console.error('Greška pri registraciji:', error.message);
    else console.log('Provjerite e-mail za potvrdu!');
  };

  return (
    <div class="max-w-md mx-auto mt-10">
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
      <button class="btn btn-primary w-full mb-2" onClick={handleLogin}>
        Prijavi se
      </button>
      <button class="btn btn-secondary w-full" onClick={handleSignUp}>
        Registriraj se
      </button>
    </div>
  );
}