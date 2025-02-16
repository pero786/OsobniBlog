import { createSignal, onMount } from 'solid-js';
import { supabase } from '../services/supabase';
import { useNavigate } from '@solidjs/router';

export default function CreatePost() {
  const [title, setTitle] = createSignal('');
  const [content, setContent] = createSignal('');
  const [categories, setCategories] = createSignal([]);
  const [selectedCategory, setSelectedCategory] = createSignal('');
  const navigate = useNavigate();

  onMount(async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      console.error('Greška pri dohvaćanju kategorija:', error.message);
    } else {
      setCategories(data);
    }
  });

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Morate biti prijavljeni!');

    const { error } = await supabase.from('posts').insert([
      {
        title: title(),
        content: content(),
        user_id: user.id,
        category_id: selectedCategory(),
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
      <select
        class="select select-bordered w-full mb-4"
        onInput={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Odaberite kategoriju</option>
        <For each={categories()}>
          {(category) => (
            <option value={category.id}>{category.name}</option>
          )}
        </For>
      </select>
      <button class="btn btn-primary w-full" onClick={handleSubmit}>
        Objavi
      </button>
    </div>
  );
}