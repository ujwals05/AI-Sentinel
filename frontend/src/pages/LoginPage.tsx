import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Shield, Mail, Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../hooks/useAuth';

// ─── Validation Schema ────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };
  console.log("API URL:", import.meta.env.VITE_API_BASE_URL);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side: Brand Identity */}
      <div className="hidden md:flex flex-1 bg-on-background relative overflow-hidden items-center justify-center p-8">
        {/* Abstract Nodes Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="4" fill="#6063ee" />
            <circle cx="600" cy="150" r="4" fill="#6063ee" />
            <circle cx="400" cy="400" r="6" fill="#6063ee" />
            <circle cx="150" cy="600" r="4" fill="#6063ee" />
            <circle cx="650" cy="650" r="4" fill="#6063ee" />

            <path
              className="node-connection"
              d="M200 200 L400 400 M600 150 L400 400 M150 600 L400 400 M650 650 L400 400"
              fill="none"
              stroke="#6063ee"
              strokeWidth="2"
            />
            <rect
              x="390"
              y="390"
              width="20"
              height="20"
              fill="none"
              stroke="#6063ee"
              strokeWidth="1"
              transform="rotate(45 400 400)"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-lg text-center">
          <div className="mb-6 flex items-center justify-center space-x-1">
            <Shield className="text-primary-fixed w-12 h-12" fill="currentColor" />
            <h1 className="font-geist text-3xl font-bold text-on-primary-container tracking-tight">
              AI Sentinel
            </h1>
          </div>
          <p className="font-geist text-5xl font-extrabold text-white mb-1 leading-tight tracking-tight">
            Govern your Intelligence.
          </p>
          <p className="font-geist text-lg text-outline-variant opacity-80 mt-4">
            The authoritative layer for model governance, observability, and compliance. Precise
            control for modern intelligence.
          </p>
        </div>

        {/* Decorative Bottom Element */}
        <div className="absolute bottom-8 left-8 border-l-2 border-primary-container pl-4">
          <p className="font-mono text-xs text-primary-fixed uppercase tracking-widest font-bold">
            Enterprise v4.2.0
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 bg-surface flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Brand Header */}
          <div className="md:hidden mb-6 text-center">
            <Shield className="text-primary w-9 h-9" fill="currentColor" />
            <h1 className="font-geist text-2xl font-bold text-on-background">AI Sentinel</h1>
          </div>

          {/* Login Card */}
          <div className="bg-white border-2 border-on-background p-8 neo-shadow">
            <h2 className="font-geist text-2xl font-bold text-on-background mb-1">Login</h2>
            <p className="font-geist text-base text-on-surface-variant mb-6">
              Access the governance console.
            </p>

            {/* Demo Credentials Notice */}
            <div className="mb-6 p-4 bg-surface-container border-2 border-on-background flex items-start space-x-3">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-geist text-sm font-bold text-on-background mb-1">Demo Environment Access</p>
                <div className="font-mono text-xs text-on-surface-variant space-y-0.5">
                  <p>Email: <span className="font-bold text-on-background">user001@email.com</span></p>
                  <p>Password: <span className="font-bold text-on-background">password</span></p>
                </div>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="font-mono text-xs font-bold text-on-surface block uppercase"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.ai"
                    {...register('email')}
                    className="w-full h-12 px-4 border-2 border-on-background font-mono text-sm focus:ring-0 focus:border-primary transition-colors placeholder:text-outline-variant"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant flex items-center">
                    <Mail className="w-5 h-5" />
                  </div>
                </div>
                {errors.email && (
                  <p className="font-mono text-xs text-error mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="font-mono text-xs font-bold text-on-surface block uppercase"
                  >
                    Password
                  </label>
                  <a href="#" className="font-mono text-xs font-bold text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    className="w-full h-12 px-4 border-2 border-on-background font-mono text-sm focus:ring-0 focus:border-primary transition-colors placeholder:text-outline-variant"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-background transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="font-mono text-xs text-error mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-5 h-5 border-2 border-on-background text-primary focus:ring-0"
                />
                <label
                  htmlFor="remember"
                  className="font-geist text-base text-on-surface cursor-pointer select-none"
                >
                  Remember this device
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-14 bg-primary text-on-primary font-geist text-2xl font-bold border-2 border-on-background neo-shadow hover:neo-shadow-active transition-all cursor-pointer disabled:opacity-80"
              >
                {isPending ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t-2 border-surface-variant text-center">
              <p className="font-geist text-base text-on-surface-variant">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="text-primary font-bold hover:underline">
                  Register
                </Link>
              </p>
            </div>
          </div>

          {/* Supporting Links */}
          <div className="mt-6 flex justify-center space-x-6">
            <a
              href="#"
              className="font-mono text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="font-mono text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
            >
              Security Audit
            </a>
            <a
              href="#"
              className="font-mono text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
            >
              System Status
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
