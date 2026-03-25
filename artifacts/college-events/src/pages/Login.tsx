import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast({ title: "Welcome back!", description: "You have logged in successfully." });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={`${import.meta.env.BASE_URL}images/pattern.png`} alt="" className="w-full h-full object-cover" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center">
          <img src={`${import.meta.env.BASE_URL}college-logo.png`} alt="PSCMR-CET" className="w-32 h-32 mx-auto mb-6 drop-shadow-2xl" />
          <h1 className="text-white font-bold text-3xl mb-3">PSCMR-CET</h1>
          <p className="text-white/80 text-lg font-medium mb-2">Event Management System</p>
          <p className="text-white/60 text-sm max-w-xs">
            Potti Sriramulu Chalavadi Mallikarjuna Rao College of Engineering and Technology, Vijayawada
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-white/70 text-sm">
            {["Browse Events","Register Online","View Gallery","Stay Updated"].map(f => (
              <div key={f} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {f}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src={`${import.meta.env.BASE_URL}college-logo.png`} alt="PSCMR-CET" className="w-12 h-12" />
            <div>
              <p className="font-bold text-primary text-lg">PSCMR-CET</p>
              <p className="text-xs text-muted-foreground">Event Management</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@pscmrce.ac.in"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn className="w-5 h-5" /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Admin Login</p>
            <p>Email: <span className="font-mono text-primary">admin@pscmrce.ac.in</span></p>
            <p>Password: <span className="font-mono text-primary">admin123</span></p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">Create account</Link>
          </p>

          <p className="text-center text-sm text-muted-foreground mt-3">
            <Link href="/" className="hover:text-primary transition-colors">← Back to Home</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
