import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  rollNumber: z.string().optional(),
  branch: z.string().optional(),
  year: z.string().optional(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

const branches = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function Register() {
  const { register: registerUser } = useAuth();
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
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        rollNumber: data.rollNumber,
        branch: data.branch,
        year: data.year,
      });
      toast({ title: "Account created!", description: "Welcome to PSCMR-CET Event Portal." });
      navigate("/events");
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {children}
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={`${import.meta.env.BASE_URL}images/pattern.png`} alt="" className="w-full h-full object-cover" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center">
          <img src={`${import.meta.env.BASE_URL}college-logo.png`} alt="PSCMR-CET" className="w-28 h-28 mx-auto mb-6 drop-shadow-2xl" />
          <h1 className="text-white font-bold text-2xl mb-2">Join PSCMR-CET</h1>
          <p className="text-white/70 text-sm max-w-xs">
            Create your account to register for events, workshops, and competitions.
          </p>
          <div className="mt-8 space-y-3 text-left">
            {[
              ["🎓","Access all college events"],
              ["📝","Easy event registration"],
              ["🏆","Track your participations"],
              ["📱","Stay notified"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3 text-white/80 text-sm">
                <span className="text-xl">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-lg py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <img src={`${import.meta.env.BASE_URL}college-logo.png`} alt="PSCMR-CET" className="w-12 h-12" />
            <div>
              <p className="font-bold text-primary text-lg">PSCMR-CET</p>
              <p className="text-xs text-muted-foreground">Event Management</p>
            </div>
          </div>

          <div className="mb-7">
            <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground">Register to participate in college events</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name *" error={errors.name?.message}>
                <input {...register("name")} placeholder="Ravi Kumar" className={inputClass} />
              </Field>
              <Field label="Roll Number" error={errors.rollNumber?.message}>
                <input {...register("rollNumber")} placeholder="24KT1A0501" className={inputClass} />
              </Field>
            </div>

            <Field label="Email Address *" error={errors.email?.message}>
              <input {...register("email")} type="email" placeholder="you@pscmrce.ac.in" className={inputClass} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Branch" error={errors.branch?.message}>
                <select {...register("branch")} className={inputClass}>
                  <option value="">Select Branch</option>
                  {branches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Year" error={errors.year?.message}>
                <select {...register("year")} className={inputClass}>
                  <option value="">Select Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Password *" error={errors.password?.message}>
              <div className="relative">
                <input {...register("password")} type={showPass ? "text" : "password"} placeholder="Min. 6 characters"
                  className={`${inputClass} pr-12`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </Field>

            <Field label="Confirm Password *" error={errors.confirmPassword?.message}>
              <input {...register("confirmPassword")} type={showPass ? "text" : "password"} placeholder="Re-enter password"
                className={inputClass} />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><UserPlus className="w-5 h-5" /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-sm text-muted-foreground mt-2">
            <Link href="/" className="hover:text-primary transition-colors">← Back to Home</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
