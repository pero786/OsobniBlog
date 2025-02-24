import { createSignal, Show } from "solid-js";
import { supabase } from "../services/supabase";
import { useNavigate } from "@solidjs/router";

export default function SignIn() {
  const [message, setMessage] = createSignal({ type: "", text: "" });
  const navigate = useNavigate();

  async function formSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setMessage({ type: "error", text: "Molimo unesite e-mail i zaporku!" });
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ type: "error", text: "Dogodila se greška prilikom prijave!" });
      } else {
        setMessage({ type: "success", text: "Prijava je uspjela!" });
        setTimeout(() => navigate("/", { replace: true }), 1000);
      }
    } catch (err) {
      console.error("Greška:", err);
      setMessage({ type: "error", text: "Došlo je do neočekivane pogreške." });
    }
  }

  return (
    <div class="max-w-lg mx-auto mt-12 p-8 bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-lg border border-gray-300">
      <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">Dobrodošli na Vaš osobni blog!</h2>
      <Show when={message().text}>
        <div
          class={`p-4 mb-4 rounded text-sm ${message().type === "error" ? "bg-red-50 text-red-700 border border-red-300" : "bg-green-50 text-green-700 border border-green-300"
            }`}
        >
          {message().text}
        </div>
      </Show>
      <form onSubmit={formSubmit}>
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2">E-mail adresa:</label>
          <input
            type="email"
            name="email"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Vaš e-mail"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 font-medium mb-2">Zaporka:</label>
          <input
            type="password"
            name="password"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Vaša zaporka"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Prijavi se
        </button>
      </form>
      <p class="text-sm text-gray-600 text-center mt-6">
        Nemate račun? <a href="/signup" class="text-blue-500 hover:underline">Registrirajte se</a>.
      </p>
    </div>
  );
}
