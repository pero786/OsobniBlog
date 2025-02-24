import { createSignal, createEffect } from 'solid-js';
import { supabase } from '../services/supabase';
import { useAuth } from '../components/AuthProvider';

export default function LikeButton({ postId }) {
    const [likes, setLikes] = createSignal(0);
    const [isLiked, setIsLiked] = createSignal(false);
    const session = useAuth();
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
    