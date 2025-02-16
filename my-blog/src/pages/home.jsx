import { createResource, createSignal, Show, For } from "solid-js";
import { supabase } from "../services/supabase";
import Comments from "../components/Comments";
import { A } from "@solidjs/router";
import { useAuth } from "../components/AuthProvider";

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
  const session = useAuth();

  const handleDelete = async (postId) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Greška pri brisanju posta:', error.message);
    } else {
      alert('Post uspješno obrisan!');
      window.location.reload(); 
    }
  };

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
            <A
              href={`/category/${category.id}`}
              class="btn btn-outline btn-sm"
            >
              {category.name}
            </A>
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

                
                <div class="flex gap-2">
                  <Show when={session() && session().user.id === post.user_id}>
                    <A
                      href={`/edit-post/${post.id}`}
                      class="btn btn-secondary flex-1"
                    >
                      Uredi
                    </A>
                    <button
                      class="btn btn-error flex-1"
                      onClick={() => handleDelete(post.id)}
                    >
                      Obriši
                    </button>
                  </Show>
                </div>

                
                <div class="mt-6">
                  <Comments postId={post.id} />
                </div>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
}