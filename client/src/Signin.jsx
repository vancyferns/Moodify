import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signin } from "./auth";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import wavesgif from "./assets/waves2.gif";
import toast from "react-hot-toast";
import { clearUserHistory, setUserHistory } from "./historyLocal";
import { fetchHistory } from "./historyApi";


const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function Signin() {
  const { setSession, setLoading } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    const res = await signin(data);
    console.log("Signin response:", res); 
    setLoading(false);
    if (!res.ok) return setError(res.error || "Signin failed");
    
     toast.success("Signed in successfully");
     setSession(res.data);
 
  clearUserHistory(); 


   const uid = res.data?.user?.id || res.data?.user?._id;
  if (uid) {
    try {
     const dbHistory = await fetchHistory(uid, 10);
      setUserHistory(dbHistory); 
    } catch (err) {
      console.error("Failed to fetch user history:", err);
    }
  }

  navigate("/", { replace: true });


  };

  return (
    <div className="relative min-h-screen text-white bg-gradient-to-b from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] flex items-center justify-center p-6 overflow-hidden">
       <img
                src={wavesgif}
                 alt="Background waves"
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        /> 

      <div className="w-full max-w-md bg-white/5 backdrop-blur rounded-2xl p-8 shadow-xl border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-6">Welcome back</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <div className="mt-1 flex items-center bg-white/10 rounded-lg px-3">
              <Mail className="w-4 h-4 text-gray-300" />
              <input
                {...register("email")}
                className="w-full bg-transparent outline-none px-2 py-2 text-white"
                placeholder="you@example.com"
                type="email"
              />
            </div>
            {errors.email && <p className="text-pink-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <div className="mt-1 flex items-center bg-white/10 rounded-lg px-3">
              <Lock className="w-4 h-4 text-gray-300" />
              <input
                {...register("password")}
                className="w-full bg-transparent outline-none px-2 py-2 text-white"
                placeholder="••••••••"
                type={showPwd ? "text" : "password"}
              />
              <button type="button" onClick={() => setShowPwd((s) => !s)} className="text-gray-300">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-pink-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

        {error && <div className="text-pink-400 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-95"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-gray-300 text-sm mt-4">
          New to Moodify?{" "}
          <Link to="/signup" className="text-purple-300 underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
