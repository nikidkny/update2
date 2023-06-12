import React, { createContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Navigate, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navto = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(navto);

  // Function to handle user login
  const handleLogin = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw new Error(error.message);
      }
      const { user } = data;
      setUser(user);

      // Fetch the course_id from the table
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("id")
        .single();

      if (courseError) {
        throw new Error(courseError.message);
      }

      const courseId = courseData.id; // Fetch the actual course id from the table

      // Insert enrollments to table
      // await supabase.from("enrollments").insert([
      //   {
      //     user_id: parseInt(data.user.id, 10),
      //     course_id: courseId,
      //   },
      // ]);

      navto("/profile");
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      setUser(null);
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log(event, session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, handleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
