import { createSignal, onMount, Show } from "solid-js";
import { supabase } from "../services/supabase";

export default function SignOut() {
  const [message, setMessage] = createSignal({ type: "", text: "" });

  onMount(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setMessage({ type: "error", text: "Odjava nije uspjela. Pokušajte ponovno." });
      } else {
        setMessage({ type: "success", text: "Uspješno ste odjavljeni!" });
      }
    } catch (err) {
      console.error("Greška prilikom odjave:", err);
      setMessage({ type: "error", text: "Došlo je do neočekivane pogreške pri odjavi." });
    }
  });

  return (
    <div class="max-w-lg mx-auto mt-12 p-8 bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-lg border border-gray-300">
      <Show when={message().text}>
        <div
          class={`p-4 rounded text-sm ${message().type === "error" ? "bg-red-50 text-red-700 border border-red-300" : "bg-green-50 text-green-700 border border-green-300"
            }`}
        >
          {message().text}
        </div>
      </Show>
    </div>
  );
}
