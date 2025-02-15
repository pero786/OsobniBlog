import { createSignal, createResource } from 'solid-js';
import { supabase } from '../services/supabase';

export default function Comments({ postId }) {
  const [comment, setComment] = createSignal('');
  const [comments, { refetch }] = createResource(() => fetchComments(postId));

  async function fetchComments(postId) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Morate biti prijavljeni!');

    const { error } = await supabase.from('comments').insert([
      {
        post_id: postId,
        user_id: user.id,
        content: comment(),
      },
    ]);

    if (error) {
      console.error('Greška pri dodavanju komentara:', error.message);
    } else {
      setComment('');
      refetch(); 
    }
  };

  return (
    <div class="mt-6">
      <h3 class="text-xl font-semibold mb-4">Komentari</h3>
      <Show when={comments()}>
        <For each={comments()}>
          {(comment) => (
            <div class="bg-gray-50 p-3 rounded-lg shadow-sm mb-3">
              <p class="text-gray-800">{comment.content}</p>
              <p class="text-sm text-gray-500 mt-1">
                Objavljeno: {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </For>
      </Show>
      <textarea
        placeholder="Napišite komentar..."
        class="textarea textarea-bordered w-full mb-2"
        onInput={(e) => setComment(e.target.value)}
      ></textarea>
      <button class="btn btn-primary" onClick={handleSubmit}>
        Pošalji
      </button>
    </div>
  );
}