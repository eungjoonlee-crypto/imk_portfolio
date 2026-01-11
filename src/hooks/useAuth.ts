import { useState, useEffect, useMemo } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

// Admin email whitelist
// Option 1: Use environment variable VITE_ADMIN_EMAILS (comma-separated)
// Option 2: Hardcode admin emails directly in the array below
const ADMIN_EMAILS = (
  import.meta.env.VITE_ADMIN_EMAILS 
    ? import.meta.env.VITE_ADMIN_EMAILS.split(",").map((email: string) => email.trim().toLowerCase())
    : [
        "eungjoonlee@gmail.com",
      ]
);

/**
 * Check if an email belongs to an admin
 * @param email - User email to check
 * @returns boolean indicating if user is admin
 */
const isAdminEmail = (email: string | undefined | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.length > 0 && ADMIN_EMAILS.includes(email.toLowerCase());
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if current user is admin
  const isAdmin = useMemo(() => {
    return isAdminEmail(user?.email);
  }, [user?.email]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    // Disable public signup - only allow admin emails
    if (!isAdminEmail(email)) {
      return {
        error: {
          message: "회원가입은 관리자만 가능합니다. 관리자에게 문의하세요.",
        } as Error,
      };
    }

    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!session,
    isAdmin,
  };
};
