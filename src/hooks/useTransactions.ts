import { useState, useEffect, useRef } from "react";
import { supabase } from "../api/supabaseClient";
import type { Transaction } from "../types/Transaction";

export const useTransactions = (userId: string | undefined) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId);
      if (error) console.error(error);
      else setTransactions(data || []);
      setLoading(false);
    };

    fetchTransactions();

    const channel = supabase
      .channel("transactions_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTransactions((prev) => [...prev, payload.new as Transaction]);
          } else if (payload.eventType === "UPDATE") {
            setTransactions((prev) =>
              prev.map((t) =>
                t.id === payload.new.id ? (payload.new as Transaction) : t
              )
            );
          } else if (payload.eventType === "DELETE") {
            setTransactions((prev) =>
              prev.filter((t) => t.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [userId]);

  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "user_id">
  ) => {
    const { error } = await supabase
      .from("transactions")
      .insert({ ...transaction, user_id: userId })
      .select()
      .single();
    if (error) throw error;
  };

  return { transactions, loading, addTransaction };
};
