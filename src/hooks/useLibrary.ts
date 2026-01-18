import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface LibraryItem {
    id?: string;
    user_id: string;
    media_id: number;
    media_type: string;
    status: 'READING' | 'COMPLETED' | 'PLAN_TO_READ' | 'DROPPED';
    progress_volume: number;
    progress_chapter: number;
    progress_episode: number;
    total_volumes?: number;
    total_chapters?: number;
    total_episodes?: number;
    title: string;
    cover_image: string;
    updated_at?: string;
}

export function useLibrary() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: library = [], isLoading } = useQuery({
        queryKey: ['library', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('user_library')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            return data as LibraryItem[];
        },
        enabled: !!user,
    });

    const upsertMutation = useMutation({
        mutationFn: async (item: Partial<LibraryItem>) => {
            if (!user) throw new Error('Auth required');

            const { data, error } = await supabase
                .from('user_library')
                .upsert({
                    ...item,
                    user_id: user.id,
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'user_id,media_id'
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['library', user?.id] });
        }
    });

    const removeMutation = useMutation({
        mutationFn: async (mediaId: number) => {
            if (!user) throw new Error('Auth required');
            const { error } = await supabase
                .from('user_library')
                .delete()
                .match({ user_id: user.id, media_id: mediaId });

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['library', user?.id] });
        }
    });

    return {
        library,
        isLoading,
        upsert: upsertMutation.mutateAsync,
        remove: removeMutation.mutateAsync,
        isUpdating: upsertMutation.isPending || removeMutation.isPending,
    };
}
