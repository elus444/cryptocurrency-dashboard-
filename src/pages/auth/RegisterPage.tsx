import { useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Hexagon, Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/lib/constants";
import { calculatePasswordStrength, registerSchema, type RegisterFormData } from "@/lib/validations/auth.schema";
import { FormAlert, FormInput, PasswordInput, PasswordRequirements, SubmitButton } from "@/components/forms";
import { useAuth } from "@/features/auth";

export default function RegisterPage() {
  const { register: signup, error, clearError, isWorking } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password");
  const agreeToTerms = watch("agreeToTerms");
  const passwordStrength = calculatePasswordStrength(password ?? "");

  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      clearError();
      await signup(data);
    },
    [clearError, signup]
  );

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <div className="flex w-full items-center justify-center p-4 lg:w-1/2">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
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
                <h2 className="font-display text-2xl font-bold">Create your account</h2>
                <p className="mt-2 text-muted-foreground">Join thousands of investors managing their digital assets securely.</p>
              </div>

              {error ? (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                  <FormAlert type="error" message={error.message} />
                </motion.div>
              ) : null}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <FormInput
                  label="Full Name"
                  type="text"
                  placeholder="Jordan Rivera"
                  leftIcon={<User className="h-4 w-4" />}
                  error={errors.name?.message}
                  {...register("name")}
                />

                <FormInput
                  label="Email"
                  type="email"
                  placeholder="jordan@ventureops.io"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <div className="space-y-2">
                  <PasswordInput
                    label="Password"
                    placeholder="StrongPass1!"
                    leftIcon={<Lock className="h-4 w-4" />}
                    error={errors.password?.message}
                    showStrength={Boolean(password)}
                    strength={passwordStrength}
                    {...register("password")}
                  />
                  {password ? <PasswordRequirements password={password} /> : null}
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox checked={agreeToTerms} onCheckedChange={(checked) => setValue("agreeToTerms", Boolean(checked))} />
                  <Label className="text-sm font-normal leading-tight">
                    I agree to the Terms of Service and Privacy Policy.
                  </Label>
                </div>

                <SubmitButton
                  variant="hero"
                  size="lg"
                  className="w-full gap-2"
                  isLoading={isWorking}
                  loadingText="Creating workspace..."
                  disabled={!agreeToTerms || passwordStrength.label === "weak"}
                >
                  Create Workspace
                  <ArrowRight className="h-4 w-4" />
                </SubmitButton>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_hsl(var(--primary)/0.18),_transparent_55%)]" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Hexagon className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold">{APP_NAME}</span>
          </Link>

          <div className="space-y-5">
            <h1 className="font-display text-4xl font-bold leading-tight">
              Start tracking your portfolio
              <br />
              <span className="gradient-text">with institutional-grade tools.</span>
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Get real-time analytics, automated reporting, and secure multi-chain asset management in one platform.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">SOC 2 compliant. Your data never leaves your control.</p>
        </div>
      </div>
    </div>
  );
}
