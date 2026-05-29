"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { AppNotification } from '@/types/begal';
import { mapNewsToBerita, NewsRow } from '@/lib/news-mapper';

const STORAGE_KEY = 'radarbegal_notifications_read';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  focusNewsId: number | null;
  setFocusNewsId: (id: number | null) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => { },
  markAllAsRead: () => { },
  focusNewsId: null,
  setFocusNewsId: () => { },
});

export const useNotifications = () => useContext(NotificationContext);

function loadReadIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [focusNewsId, setFocusNewsId] = useState<number | null>(null);

  useEffect(() => {
    setReadIds(loadReadIds());
  }, []);

  const addNotification = useCallback((row: NewsRow, isInitial = false) => {
    const berita = mapNewsToBerita(row);
    const notif: AppNotification = {
      id: `news-${row.id}-${row.published_at || row.created_at}`,
      newsId: row.id,
      title: berita.judul,
      location: berita.lokasi,
      riskLevel: berita.tingkat_risiko,
      publishedAt: row.published_at || row.created_at,
      read: false,
    };

    setNotifications((prev) => {
      if (prev.some((n) => n.newsId === notif.newsId && n.publishedAt === notif.publishedAt)) {
        return prev;
      }
      const next = [notif, ...prev].slice(0, 50);
      if (!isInitial && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Berita Keamanan Baru', {
          body: `${notif.title} — ${notif.location}`,
        });
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('public:news:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'news' },
        (payload) => {
          addNotification(payload.new as NewsRow);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addNotification]);

  useEffect(() => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: readIds.has(n.id) }))
    );
  }, [readIds]);

  const markAsRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      notifications.forEach((n) => next.add(n.id));
      saveReadIds(next);
      return next;
    });
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;


  return (
    <NotificationContext.Provider
      value={{
        notifications: notifications.map((n) => ({ ...n, read: readIds.has(n.id) })),
        unreadCount,
        markAsRead,
        markAllAsRead,
        focusNewsId,
        setFocusNewsId,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
