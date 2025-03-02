import { createSignal, createEffect } from 'solid-js';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/AuthProvider';

export default function LikeButton({ postId }) {
    const [likes, setLikes] = createSignal(0); 
    const [isLiked, setIsLiked] = createSignal(false); 
    const session = useAuth(); 

    createEffect(async () => {
        try {
            const { count, error: countError } = await supabase
                .from('likes')
                .select('*', { count: 'exact' })
                .eq('post_id', postId);

            if (countError) throw countError;
            setLikes(count || 0);

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
            console.error('Greška pri dohvaćanju podataka o lajkovima:', error.message);
        }
    });

    const handleLike = async () => {
        if (!session()) return alert('Morate biti prijavljeni!');

        try {
            if (isLiked()) {
                const { error: deleteError } = await supabase
                    .from('likes')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_id', session().user.id);

                if (deleteError) throw deleteError;

                setIsLiked(false);
                setLikes((prev) => Math.max(0, prev - 1));
            } else {
                const { error: insertError } = await supabase
                    .from('likes')
                    .insert([{ post_id: postId, user_id: session().user.id }]);

                if (insertError) throw insertError;

                setIsLiked(true);
                setLikes((prev) => prev + 1);
            }
        } catch (error) {
            console.error('Greška pri lajkanju/odlajkivanju:', error.message);
        }
    };

    return (
        <button
            class={`btn ${isLiked() ? 'btn-primary' : 'btn-outline'}`}
            onClick={handleLike}
            disabled={!session()} 
        >
            ❤️ {likes()}
        </button>
    );
}
