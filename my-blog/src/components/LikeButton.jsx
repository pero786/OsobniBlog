import { createSignal, createEffect } from 'solid-js';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/AuthProvider';

export default function LikeButton({ postId }) {
    const [likes, setLikes] = createSignal(0);
    const [isLiked, setIsLiked] = createSignal(false);
    const session = useAuth();

    // Dohvati broj lajkova i provjeri je li korisnik lajkao objavu
    createEffect(async () => {
        const { count, error } = await supabase
            .from('likes')
            .select('*', { count: 'exact' })
            .eq('post_id', postId);

        if (error) {
            console.error('Greška pri dohvaćanju lajkova:', error.message);
        } else {
            setLikes(count || 0);
        }

        if (session()) {
            const { data, error: likeError } = await supabase
                .from('likes')
                .select('*')
                .eq('post_id', postId)
                .eq('user_id', session().user.id)
                .single();

            if (likeError && likeError.code !== 'PGRST116') {
                console.error('Greška pri provjeri lajka:', likeError.message);
            } else {
                setIsLiked(!!data);
            }
        }
    });

    // Funkcija za lajkanje/odlajkivanje
    const handleLike = async () => {
        if (!session()) return alert('Morate biti prijavljeni!');

        if (isLiked()) {
            // Odlajkaj
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', session().user.id);

            if (error) {
                console.error('Greška pri odlajkivanju:', error.message);
            } else {
                setIsLiked(false);
                setLikes((prev) => prev - 1);
            }
        } else {
            // Lajkaj
            const { error } = await supabase
                .from('likes')
                .insert([{ post_id: postId, user_id: session().user.id }]);

            if (error) {
                console.error('Greška pri lajkanju:', error.message);
            } else {
                setIsLiked(true);
                setLikes((prev) => prev + 1);
            }
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