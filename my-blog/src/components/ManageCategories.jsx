import { createSignal, createResource } from 'solid-js';
import { supabase } from '../services/supabase';

export default function ManageCategories() {
  const [name, setName] = createSignal('');
  const [categories, { refetch }] = createResource(() => fetchCategories());

  async function fetchCategories() {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data;
  }

  const handleAddCategory = async () => {
    const { error } = await supabase.from('categories').insert([{ name: name() }]);
    if (error) {
      console.error('Greška pri dodavanju kategorije:', error.message);
    } else {
      setName('');
      refetch(); 
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const { error } = await supabase.from('categories').delete().eq('id', categoryId);
    if (error) {
      console.error('Greška pri brisanju kategorije:', error.message);
    } else {
      refetch(); 
    }
  };

  return (
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center mb-6">Upravljanje kategorijama</h2>
      <input
        type="text"
        placeholder="Naziv kategorije"
        class="input input-bordered w-full mb-4"
        value={name()}
        onInput={(e) => setName(e.target.value)}
      />
      <button class="btn btn-primary w-full mb-4" onClick={handleAddCategory}>
        Dodaj kategoriju
      </button>
      <ul>
        <For each={categories()}>
          {(category) => (
            <li class="flex justify-between items-center mb-2">
              <span>{category.name}</span>
              <button
                class="btn btn-error btn-sm"
                onClick={() => handleDeleteCategory(category.id)}
              >
                Obriši
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}