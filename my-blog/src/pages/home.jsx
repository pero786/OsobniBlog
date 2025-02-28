import { createResource, createSignal, Show, For } from "solid-js";
import { supabase } from "../services/supabase";
import Comments from "../components/Comments";
import LikeButton from "../components/LikeButton";

async function fetchPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  return data;
}

export default function Home() {
  const [posts] = createResource(fetchPosts);
  const [categories] = createResource(fetchCategories);
  const [selectedCategory, setSelectedCategory] = createSignal('');

  const filteredPosts = () => {
    if (!selectedCategory()) return posts();
    return posts().filter((post) => post.category_id === selectedCategory());
  };

  return (
    <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-4">
        Dobrodošli na moj osobni blog!
      </h1>
      <p class="text-lg text-gray-600 text-center">
        Ovo je mjesto za najjače projekte i ideje. Nadam se da će vam biti zanimljivo!
      </p>

      <div class="mt-8">
        <select
          class="select select-bordered w-full mb-4"
          onInput={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Sve kategorije</option>
          <For each={categories()}>
            {(category) => (
              <option value={category.id}>{category.name}</option>
            )}
          </For>
        </select>
      </div>

      <div class="flex flex-wrap gap-2 mb-6">
        <For each={categories()}>
          {(category) => (
            <a href={`/category/${category.id}`} class="btn btn-outline btn-sm">
              {category.name}
            </a>
          )}
        </For>
      </div>

      <div class="mt-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Najnoviji članci</h2>
        <Show when={!posts.loading} fallback={<p class="text-center">Učitavanje...</p>}>
          <For each={filteredPosts()}>
            {(post) => (
              <div class="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
                <h3 class="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                <p class="text-gray-600 mb-4">{post.content}</p>
                <p class="text-sm text-gray-500 mb-4">
                  Kategorija: {post.categories?.name || 'Nema kategorije'} | Objavljeno: {new Date(post.created_at).toLocaleDateString()}
                </p>

                {/* Prikaz LikeButton-a */}
                <LikeButton postId={post.id} />

                {/* Prikaz komentara */}
                <Comments postId={post.id} />
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
}
