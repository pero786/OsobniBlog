import { createSignal, createEffect } from 'solid-js';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/AuthProvider';

export default function LikeButton({ postId }) {
    const [likes, setLikes] = createSignal(0);
    const [isLiked, setIsLiked] = createSignal(false);
    const session = useAuth();

    // Dohvati broj lajkova i provjeri je li korisnik lajkao objavu
    createEffect(async () => {
        try {
            // Dohvati broj lajkova za post
            const { count, error: countError } = await supabase
                .from('likes')
                .select('*', { count: 'exact' })
                .eq('post_id', postId);

            if (countError) throw countError;
            setLikes(count || 0);

            // Provjeri je li korisnik lajkao objavu (samo ako je prijavljen)
            if (session()) {
                const { data: likeData, error: likeError } = await supabase
                    .from('likes')
                    .select('*')
                    .eq('post_id', postId)
                    .eq('user_id', session().user.id)
                    .maybeSingle();

                if (likeError) throw likeError;
                setIsLiked(!!likeData);
            }
        } catch (error) {
            console.error('Greška pri dohvaćanju podataka:', error.message);
        }
    });


    // Funkcija za lajkanje/odlajkivanje
    const handleLike = async () => {
        if (!session()) return alert('Morate biti prijavljeni!');

        try {
            if (isLiked()) {
                // Odlajkaj
                console.log('Pokušaj brisanja lajka...');
                const { error: deleteError } = await supabase
                    .from('likes')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_id', session().user.id);

                if (deleteError) throw deleteError;

                setIsLiked(false);
                setLikes((prev) => Math.max(0, prev - 1));
                console.log('Lajk uspješno obrisan.');
            } else {
                // Lajkaj
                console.log('Pokušaj dodavanja lajka...');
                const { data: existingLike, error: checkError } = await supabase
                    .from('likes')
                    .select('*')
                    .eq('post_id', postId)
                    .eq('user_id', session().user.id)
                    .maybeSingle();

                if (checkError) throw checkError;

                if (!existingLike) {
                    const { error: insertError } = await supabase
                        .from('likes')
                        .insert([{ post_id: postId, user_id: session().user.id }]);

                    if (insertError) throw insertError;

                    setIsLiked(true);
                    setLikes((prev) => prev + 1);
                    console.log('Lajk uspješno dodan.');
                }
            }
        } catch (error) {
            console.error('Greška pri lajkanju/odlajkivanju:', error.message);
            alert(`Došlo je do greške: ${error.message}`);
        }
    };

    return (
        <button
            class={`btn ${isLiked() ? 'btn-primary' : 'btn-outline'}`}
            onClick={handleLike}
        >
            ❤️ {likes()}
        </button>
    );
}
