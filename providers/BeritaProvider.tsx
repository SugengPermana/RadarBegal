"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { BeritaBegal } from '@/types/begal';
import { mapNewsToBerita, NewsRow } from '@/lib/news-mapper';

interface BeritaContextType {
  beritaData: BeritaBegal[];
  isLoading: boolean;
  error: Error | null;
}

const BeritaContext = createContext<BeritaContextType>({
  beritaData: [],
  isLoading: true,
  error: null,
});

export const useBerita = () => useContext(BeritaContext);

export const BeritaProvider = ({ children }: { children: React.ReactNode }) => {
  const [beritaData, setBeritaData] = useState<BeritaBegal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchBerita = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false });

        if (fetchError) throw fetchError;

        if (mounted && data) {
          setBeritaData((data as NewsRow[]).map(mapNewsToBerita));
        }
      } catch (err) {
        if (mounted) setError(err as Error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchBerita();

    const channel = supabase
      .channel('public:news')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news' },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            const item = mapNewsToBerita(payload.new as NewsRow);
            setBeritaData((prev) => [item, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const item = mapNewsToBerita(payload.new as NewsRow);
            setBeritaData((prev) =>
              prev.map((row) => (row.id === item.id ? item : row))
            );
          } else if (payload.eventType === 'DELETE') {
            setBeritaData((prev) =>
              prev.filter((row) => row.id !== (payload.old as NewsRow).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);


  return (
    <BeritaContext.Provider value={{ beritaData, isLoading, error }}>
      {children}
    </BeritaContext.Provider>
  );
};
