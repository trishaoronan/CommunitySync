import { supabase } from "@/lib/supabase";
import type { Notification } from "@/types/database";
import { useEffect, useRef, useState } from "react";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const userIdRef = useRef<string | null>(null);

  const computeUnread = (items: Notification[]) =>
    items.filter((n) => !n.is_read).length;

  const fetchNotifications = async (userId: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return;

    setNotifications(data as Notification[]);
    setUnreadCount(computeUnread(data as Notification[]));
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!isMounted || !userData.user) {
        setIsLoading(false);
        return;
      }

      const userId = userData.user.id;
      userIdRef.current = userId;

      await fetchNotifications(userId);
      if (isMounted) setIsLoading(false);

      const channel = supabase
        .channel(`notifications:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (!isMounted) return;
            const newItem = payload.new as Notification;
            setNotifications((prev) => [newItem, ...prev]);
            setUnreadCount((prev) => prev + 1);
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    void init();

    return () => {
      isMounted = false;
    };
  }, []);

  const markAsRead = async (id: string) => {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    const userId = userIdRef.current;
    if (!userId) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  return { notifications, isLoading, unreadCount, markAsRead, markAllRead };
};
