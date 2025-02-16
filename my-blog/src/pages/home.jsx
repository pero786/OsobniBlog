import { createResource, Show } from "solid-js";
import { supabase } from "../services/supabase";
import Comments from "../components/Comments";
import { A } from "@solidjs/router";

async function fetchPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export default function Home() {
  const [posts] = createResource(fetchPosts);

  return (
    <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-4">
        Dobrodošli na moj osobni blog!
      </h1>
      <p class="text-lg text-gray-600 text-center">
        Ovo je mjesto za najjače projekte i ideje. Nadam se da će vam biti zanimljivo!
      </p>
      <div class="mt-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Najnoviji članci</h2>
        <Show when={!posts.loading} fallback={<p>Učitavanje...</p>}>
          <For each={posts()}>
            {(post) => (
              <div class="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                <h3 class="text-xl font-bold text-gray-800">{post.title}</h3>
                <p class="text-gray-600">{post.content}</p>
                <p class="text-sm text-gray-500 mt-2">
                  Objavljeno: {new Date(post.created_at).toLocaleDateString()}
                </p>
                <Comments postId={post.id} />
                <A href={`/edit-post/${post.id}`} class="btn btn-secondary">
                  Uredi
                </A>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
}