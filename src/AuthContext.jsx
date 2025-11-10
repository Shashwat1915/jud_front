// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Create a Context
const AuthContext = createContext();

// Custom Hook to easily access auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // current user object
  const [loading, setLoading] = useState(true);  // loading state during initialization
  const [error, setError] = useState(null);      // optional error state
  const [role, setRole] = useState(null);        // user role ("Student" or "Lawyer")

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // ✅ User is signed in
          setUser(firebaseUser);

          // If you later store roles in displayName (temporary)
          if (firebaseUser.displayName) {
            setRole(firebaseUser.displayName);
          }

          // (Optional) If you add Firestore roles later, you can fetch it here:
          // const docRef = doc(db, "users", firebaseUser.uid);
          // const docSnap = await getDoc(docRef);
          // if (docSnap.exists()) setRole(docSnap.data().role);

        } else {
          // ❌ User is logged out
          setUser(null);
          setRole(null);
        }
      } catch (err) {
        console.error("Auth state error:", err);
        setError("Failed to fetch user info.");
      } finally {
        setLoading(false);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Logout failed. Try again.");
    }
  };

  // Context value (shared globally)
  const value = {
    user,
    role,
    loading,
    error,
    logout,
    isAuthenticated: !!user,
  };

  // Don’t render app until Firebase confirms auth state
  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          color: "#0052FF"
        }}>
          <h3>Connecting to Judicio...</h3>
        </div>
      )}
    </AuthContext.Provider>
  );
};
