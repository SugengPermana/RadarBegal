"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { UserProfile } from '@/types/begal';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => { },
  refreshProfile: async () => { },
});

export const useAuth = () => useContext(AuthContext);

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, avatar_url, role, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as UserProfile;
}

async function ensureUserProfile(user: User): Promise<UserProfile | null> {
  const existing = await fetchProfile(user.id);
  if (existing) return existing;

  const username = user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`;
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: user.id,
      username,
      role: 'user',
    })
    .select('id, username, avatar_url, role, created_at')
    .single();

  if (error) {
    return {
      id: user.id,
      username,
      avatar_url: null,
      role: 'user',
      created_at: new Date().toISOString(),
    };
  }
  return data as UserProfile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    const p = await fetchProfile(user.id);
    setProfile(p ?? {
      id: user.id,
      username: user.email?.split('@')[0] || 'Pengguna',
      avatar_url: null,
      role: 'user',
      created_at: new Date().toISOString(),
    });
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        const p = await ensureUserProfile(initialSession.user);
        if (mounted) setProfile(p);
      }

      if (mounted) setIsLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, newSession: any) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const p = await ensureUserProfile(newSession.user);
        if (mounted) setProfile(p);
      } else {
        setProfile(null);
      }
      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, profile, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
