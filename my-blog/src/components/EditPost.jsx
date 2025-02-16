import { createSignal, onMount } from 'solid-js';
import { supabase } from '../services/supabase';
import { useNavigate, useParams } from '@solidjs/router';

export default function EditPost() {
  const [title, setTitle] = createSignal('');
  const [content, setContent] = createSignal('');
  const navigate = useNavigate();
  const params = useParams();

  onMount(async () => {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Greška pri dohvaćanju posta:', error.message);
    } else {
      setTitle(post.title);
      setContent(post.content);
    }
  });

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Morate biti prijavljeni!');

    const { error } = await supabase
      .from('posts')
      .update({ title: title(), content: content() })
      .eq('id', params.id);

    if (error) {
      console.error('Greška pri ažuriranju posta:', error.message);
    } else {
      alert('Post uspješno ažuriran!');
      navigate('/');
    }
  };

  return (
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center mb-6">Uredi objavu</h2>
      <input
        type="text"
        placeholder="Naslov"
        class="input input-bordered w-full mb-4"
        value={title()}
        onInput={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Sadržaj"
        class="textarea textarea-bordered w-full mb-4"
        value={content()}
        onInput={(e) => setContent(e.target.value)}
      ></textarea>
      <button class="btn btn-primary w-full" onClick={handleSubmit}>
        Spremi promjene
      </button>
    </div>
  );
}