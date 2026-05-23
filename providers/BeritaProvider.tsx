"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BeritaBegal } from '@/types/begal';

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
        const { data, error } = await supabase
          .from('berita_begal')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (mounted && data) {
          setBeritaData(data as BeritaBegal[]);
        }
      } catch (err: any) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchBerita();

    const channel = supabase
      .channel('public:berita_begal')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'berita_begal' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBeritaData((prev) => [payload.new as BeritaBegal, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setBeritaData((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? (payload.new as BeritaBegal) : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setBeritaData((prev) =>
              prev.filter((item) => item.id !== payload.old.id)
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
