import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginDialogProps {
  children: React.ReactNode;
  defaultTab?: "login" | "register";
}

export function LoginDialog({ children, defaultTab = "login" }: LoginDialogProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [open, setOpen] = useState(false);

  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const { register, login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === "register") {
        await register({ username: regUsername.trim(), email: regEmail.trim(), password: regPassword });
        toast({ title: "Registered", description: "Welcome! You are now logged in." });
      } else {
        await login({ identifier: loginId.trim(), password: loginPassword });
        toast({ title: "Logged in", description: "You are now logged in." });
      }
      setOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Something went wrong" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-5xl p-0 border-0 bg-transparent shadow-none max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] lg:max-h-[80vh] overflow-hidden">
        <div className="relative w-full h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] xl:h-[75vh] rounded-2xl overflow-hidden bg-[#06100A] flex">
          {/* Left Side - Background Image */}
          <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/aaf8edd3e166125e1471b4f58002d87d4835de79?width=1544"
              alt="Background"
              className="w-full h-full object-cover"
            />

            {/* Logo Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-start pt-8 z-10">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/7d0a42c6f2567cdd3cced28667de6b7d492f0faf?width=376"
                alt="RO CART"
                className="w-48 h-12 object-contain"
              />
            </div>

            {/* Bottom Terms Text (inside image) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 z-10">
              <p className="text-white/90 text-sm text-center font-['Poppins'] leading-relaxed max-w-sm">
                By accessing the site, I attest that I am at least 18 years old and have read the Terms and Conditions
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 lg:w-[55%] bg-[#06100A] p-6 sm:p-8 lg:p-12 overflow-auto dialog-scroll">
            {/* Tabs */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("register")}
                    className={cn(
                      "px-8 py-3 text-lg font-semibold font-['Poppins'] transition-colors",
                      activeTab === "register" ? "text-white" : "text-[#797979]"
                    )}
                  >
                    Register
                  </button>
                  <button
                    onClick={() => setActiveTab("login")}
                    className={cn(
                      "px-8 py-3 text-lg font-semibold font-['Poppins'] transition-colors",
                      activeTab === "login" ? "text-white" : "text-[#797979]"
                    )}
                  >
                    Login
                  </button>
                </div>
                
                {/* Tab Indicator */}
                <div className="absolute bottom-0 h-1 bg-white transition-all duration-300"
                     style={{
                       width: activeTab === "register" ? "50%" : "50%",
                       left: activeTab === "register" ? "0%" : "50%"
                     }}
                />
                <div className="absolute bottom-0 h-0.5 w-full bg-[#797979]" />
              </div>
            </div>

            {/* Logo for mobile */}
            <div className="lg:hidden flex justify-center mb-8">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/7d0a42c6f2567cdd3cced28667de6b7d492f0faf?width=376"
                alt="RO CART"
                className="w-32 h-8 object-contain"
              />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === "register" ? (
                <>
                  {/* Username Field */}
                  <div>
                    <label className="block text-white text-sm font-['Poppins'] mb-2">
                      Username*
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter Username"
                      className="w-full h-12 bg-[#030804] border-0 rounded-md text-white placeholder:text-white/30 font-['Poppins']"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-white text-sm font-['Poppins'] mb-2">
                      Email*
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter Email"
                      className="w-full h-12 bg-[#030804] border-0 rounded-md text-white placeholder:text-white/30 font-['Poppins']"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-white text-sm font-['Poppins'] mb-2">
                      Password*
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        className="w-full h-12 bg-[#030804] border-0 rounded-md text-white placeholder:text-white/30 font-['Poppins'] pr-12"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white/80"
                      >
                        {showPassword ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      className="mt-1 border-[#737373] data-[state=checked]:bg-[#3DFF88] data-[state=checked]:border-[#3DFF88]"
                    />
                    <label htmlFor="terms" className="text-white text-xs font-['Poppins'] leading-relaxed">
                      I agree to the{" "}
                      <span className="font-bold">Terms and Conditions</span>{" "}
                      and{" "}
                      <span className="font-bold">Privacy Policy.</span>
                    </label>
                  </div>

                  {/* Referral Code Field */}
                  <div>
                    <label className="block text-white text-sm font-['Poppins'] mb-2">
                      Referral Code (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter Code"
                      className="w-full h-12 bg-[#030804] border-0 rounded-md text-white placeholder:text-white/30 font-['Poppins']"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Email/Username Field */}
                  <div>
                    <label className="block text-white text-sm font-['Poppins'] mb-2">
                      Email or Username*
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter Email or Username"
                      className="w-full h-12 bg-[#030804] border-0 rounded-md text-white placeholder:text-white/30 font-['Poppins']"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-white text-sm font-['Poppins'] mb-2">
                      Password*
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter Password"
                      className="w-full h-12 bg-[#030804] border-0 rounded-md text-white placeholder:text-white/30 font-['Poppins']"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <div className="text-right mt-2">
                      <button
                        type="button"
                        className="text-white text-xs font-['Poppins'] underline hover:no-underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={activeTab === "register" && !agreedToTerms}
                className="w-full h-12 bg-gradient-to-b from-[#3DFF88] to-[#259951] hover:from-[#34e077] hover:to-[#228a47] text-white font-semibold text-base font-['Poppins'] rounded-md border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {activeTab === "register" ? "Register" : "Login"}
              </Button>

              {/* Divider */}
              <div className="text-center">
                <span className="text-white text-xs font-['Poppins']">
                  or continue with
                </span>
              </div>

              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto mx-auto flex items-center justify-center gap-3 h-12 px-8 bg-transparent border border-white hover:bg-white/5 text-white font-semibold text-base font-['Poppins'] rounded-md"
              >
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/c02c33e96a8ddad38f5cb8e96b9af03b17da3cf7?width=30"
                  alt="Google"
                  className="w-4 h-4"
                />
                Google
              </Button>
            </form>

            {/* Terms text for mobile */}
            <div className="lg:hidden mt-8 pt-6 border-t border-white/10">
              <p className="text-white text-sm text-center font-['Poppins'] leading-relaxed">
                By accessing the site, I attest that I am at least 18 years old and have read the Terms and Conditions
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
