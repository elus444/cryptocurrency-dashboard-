import { useState, useCallback } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Hexagon, Mail, Chrome, Github, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { APP_NAME } from "@/lib/constants"

export default function OAuthLoginPage() {
  const [isLoading, setIsLoading] = useState<"google" | "github" | null>(null)

  const handleOAuthLogin = useCallback(async (provider: "google" | "github") => {
    setIsLoading(provider)
    // OAuth provider integration is not yet configured.
    // Wire up @react-oauth/google or @octokit/oauth-app here.
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsLoading(null)
    toast.error(`${provider === "google" ? "Google" : "GitHub"} login is not configured yet.`, {
      description: "Use email and password to sign in.",
    })
  }, [])

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Left Side - Branding */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--primary)/0.15)_0%,_transparent_50%)]" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Hexagon className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold">{APP_NAME}</span>
          </Link>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="font-display text-4xl font-bold leading-tight">
                Sign in with
                <br />
                <span className="gradient-text">your preferred account.</span>
              </h1>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">
                Quick, secure, and hassle-free authentication with Google or GitHub.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {["Instant sign-in with your account", "Secure OAuth 2.0 authentication", "No password to remember"].map(
                (feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ),
              )}
            </motion.div>
          </div>

          <p className="text-sm text-muted-foreground">© 2026 CryptoFolio Inc. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - OAuth Form */}
      <div className="flex w-full items-center justify-center p-4 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
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
              {/* Back Button */}
              <div className="mb-8">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Button>
                </Link>
              </div>

              <div className="mb-8 text-center">
                <h2 className="font-display text-2xl font-bold">Sign in with OAuth</h2>
                <p className="mt-2 text-muted-foreground">Choose your preferred authentication method</p>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-3">
                {/* Google Sign In */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOAuthLogin("google")}
                  disabled={isLoading !== null}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-3 bg-transparent"
                    disabled={isLoading !== null}
                  >
                    <Chrome className="h-5 w-5" />
                    <span>Sign in with Google</span>
                    {isLoading === "google" && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                        className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent"
                      />
                    )}
                  </Button>
                </motion.button>

                {/* GitHub Sign In */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOAuthLogin("github")}
                  disabled={isLoading !== null}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-3 bg-transparent"
                    disabled={isLoading !== null}
                  >
                    <Github className="h-5 w-5" />
                    <span>Sign in with GitHub</span>
                    {isLoading === "github" && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                        className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent"
                      />
                    )}
                  </Button>
                </motion.button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or use email</span>
                </div>
              </div>

              <Link to="/login" className="block w-full">
                <Button variant="hero" size="lg" className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  Continue with Email
                </Button>
              </Link>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>

              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 rounded-lg bg-primary/5 p-4 text-xs text-muted-foreground border border-primary/10"
              >
                Your data is encrypted end-to-end. We never store your OAuth credentials.
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
