import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "~/components/provider/authcontext";
import { postdata } from "~/lib/fetchutil";
import { CheckCircle } from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get("token");
  const [manualToken, setManualToken] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const { setisAuthenticated } = useAuth();

  // ✅ Auto verify if token exists in URL
  useEffect(() => {
    if (!urlToken) return;
    handleVerification(urlToken);
  }, [urlToken]);

  // ✅ Common verification function
  const handleVerification = async (token: string) => {
    setStatus("pending");
    try {
      const res = await postdata("/auth/verify-email", { token });
      if (res?.success) {
        setisAuthenticated(true);
        setStatus("success");
        toast.success("Email verified successfully!");
        // Redirect after 1 second
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setStatus("error");
        toast.error("Invalid or expired token.");
      }
    } catch {
      setStatus("error");
      toast.error("Something went wrong. Try again.");
    }
  };

  // ✅ Manual verification
  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) {
      toast.error("Please enter your token.");
      return;
    }
    handleVerification(manualToken.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-semibold mb-4">Email Verification</h2>

      {/* ✅ Loading/Success Box */}
      {status === "pending" && (
        <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-xl p-6 animate-pulse">
          <p className="text-blue-600 font-medium">Verifying your email...</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-2xl p-6 transition-transform duration-500 scale-105 animate-fade-in">
          <CheckCircle className="text-green-500 w-12 h-12 animate-bounce" />
          <p className="text-green-600 font-semibold mt-2">
            Verified! Redirecting...
          </p>
        </div>
      )}

      {status === "error" && (
        <p className="text-red-600 font-medium mt-2">
          ❌ Verification failed. Please try again.
        </p>
      )}

      {/* ✅ Manual Token Entry Form */}
      {status !== "pending" && status !== "success" && (
        <form
          onSubmit={handleManualVerify}
          className="flex flex-col items-center gap-3 w-full max-w-sm mt-6 bg-white p-5 rounded-xl shadow"
        >
          <label htmlFor="token" className="font-medium text-gray-700">
            Enter verification token:
          </label>
          <input
            id="token"
            type="text"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Paste your token here"
          />
          <button
            type="submit"
            className="w-full py-2 rounded text-white font-medium transition-colors bg-blue-600 hover:bg-blue-700"
          >
            Verify Token
          </button>
        </form>
      )}
    </div>
  );
};

export default VerifyEmail;
