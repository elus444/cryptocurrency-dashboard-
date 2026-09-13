import { useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Github, Hexagon, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/lib/constants";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth.schema";
import { FormAlert, FormInput, PasswordInput, SubmitButton } from "@/components/forms";
import { useAuth } from "@/features/auth";

export default function LoginPage() {
  const { login, error, clearError, isWorking } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      clearError();
      await login(data);
    },
    [clearError, login]
  );

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.18),_transparent_55%)]" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Hexagon className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold">{APP_NAME}</span>
          </Link>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-display text-4xl font-bold leading-tight">
                Enterprise-grade portfolio
                <br />
                <span className="gradient-text">analytics and management.</span>
              </h1>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">
                Secure access to your digital assets with institutional-grade security,
                real-time analytics, and comprehensive reporting.
              </p>
            </motion.div>
          </div>

          <p className="text-sm text-muted-foreground">Secure, compliant, and built for institutional investors.</p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-4 lg:w-1/2">
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Hexagon className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold">{APP_NAME}</span>
            </Link>
          </div>

          <Card variant="glass" className="p-8">
            <CardContent className="p-0">
              <div className="mb-8 text-center">
                <h2 className="font-display text-2xl font-bold">Sign in to your workspace</h2>
                <p className="mt-2 text-muted-foreground">JWT auth, refresh flow, protected routes, and persisted sessions.</p>
              </div>

              {error ? (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                  <FormAlert type="error" message={error.message} />
                </motion.div>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  setValue("email", "owner@company.com");
                  setValue("password", "SecurePass1!");
                }}
                className="mb-6 w-full rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-2.5 text-center text-sm text-primary transition-colors hover:bg-primary/10"
              >
                Use demo credentials
              </button>

              <div className="mb-6 grid grid-cols-2 gap-3">
                <Link
                  to="/login/oauth"
                  className="flex items-center justify-center rounded-lg border border-border bg-transparent px-4 py-2 text-sm transition-colors hover:bg-accent"
                >
                  Google SSO
                </Link>
                <Link
                  to="/login/oauth"
                  className="flex items-center justify-center rounded-lg border border-border bg-transparent px-4 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <Github className="mr-2 inline h-4 w-4" />
                  GitHub
                </Link>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <FormInput
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <PasswordInput
                  label="Password"
                  placeholder="••••••••"
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                  {...register("password")}
                />

                <div className="flex items-center gap-2">
                  <Checkbox checked={rememberMe} onCheckedChange={(checked) => setValue("rememberMe", Boolean(checked))} />
                  <Label className="text-sm font-normal">Remember me across browser restarts</Label>
                </div>

                <SubmitButton variant="hero" size="lg" className="w-full gap-2" isLoading={isWorking} loadingText="Signing in...">
                  Enter Dashboard
                  <ArrowRight className="h-4 w-4" />
                </SubmitButton>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Need a workspace?{" "}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  Create an account
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
