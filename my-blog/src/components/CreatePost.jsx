import { createSignal, Show } from "solid-js";
import { supabase } from "../services/supabase";
import { useNavigate } from "@solidjs/router";

export default function CreatePost() {
  const [title, setTitle] = createSignal('');
  const [content, setContent] = createSignal('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const user = supabase.auth.user();
    if (!user) return alert('Morate biti prijavljeni!');

    const { error } = await supabase.from('posts').insert([
      {
        title: title(),
        content: content(),
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error('Greška pri dodavanju posta:', error.message);
    } else {
      alert('Post uspješno dodan!');
      navigate('/');
    }
  };

  return (
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center mb-6">Nova objava</h2>
      <input
        type="text"
        placeholder="Naslov"
        class="input input-bordered w-full mb-4"
        onInput={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Sadržaj"
        class="textarea textarea-bordered w-full mb-4"
        onInput={(e) => setContent(e.target.value)}
      ></textarea>
      <button class="btn btn-primary w-full" onClick={handleSubmit}>
        Objavi
      </button>
    </div>
  );
}