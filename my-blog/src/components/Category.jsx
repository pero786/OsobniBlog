import { createResource, For, Show } from 'solid-js';
import { supabase } from '../services/supabase';
import { useParams } from '@solidjs/router';

export default function Category() {
  const params = useParams();
  const [posts] = createResource(() => fetchPosts(params.id));

  async function fetchPosts(categoryId) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, categories(name)')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  return (
    <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-4">
        Objave u kategoriji
      </h1>
      <Show when={!posts.loading} fallback={<p class="text-center">Učitavanje...</p>}>
        <For each={posts()}>
          {(post) => (
            <div class="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
              <h3 class="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
              <p class="text-gray-600 mb-4">{post.content}</p>
              <p class="text-sm text-gray-500 mb-4">
                Objavljeno: {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
}