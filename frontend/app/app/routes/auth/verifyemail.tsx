import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "~/components/provider/authcontext";
import { postdata } from "~/lib/fetchutil";

const Verifyemail = () => {
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get("token");
  const [manualToken, setManualToken] = useState("");
  const navigate = useNavigate();
  const { setisAuthenticated } = useAuth();
  const [status, setStatus] = useState<"pending" | "success" | "error" | "idle">("idle");

  // ✅ Automatic verification via link (safe version)
  useEffect(() => {
  if (!urlToken) return;
  setStatus("pending");
  let isMounted = true;
  const verify = async () => {
    try {
      const res = await postdata("/auth/verify-email", { token: urlToken });
      if (res && res.success) {
        setisAuthenticated(true);
        setStatus("success");
        setTimeout(() => {
          if (isMounted) navigate("/dashboard");
        }, 500);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };
  verify();
  return () => {
    isMounted = false;
  };
}, [urlToken, setisAuthenticated, navigate]);

  // ✅ Manual verification handler (unchanged, but with safety)
  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) {
      setStatus("error");
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    setStatus("pending");
    try {
      const res = await postdata("/auth/verify-email", { token: manualToken.trim(), signal });

      if (res && res.success) {
        setisAuthenticated(true);
        setStatus("success");

        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        setStatus("error");
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h2 className="text-xl font-bold mb-2">Email Verification</h2>

      {/* Status messages */}
      {urlToken && status === "pending" && <p>Verifying your email...</p>}
      {status === "success" && (
        <p className="text-green-600">
          Token verified! Redirecting to dashboard...
        </p>
      )}
      {status === "error" && (
        <p className="text-red-600">
          Verification failed. Please check your link or try again.
        </p>
      )}

      {/* Manual verification form */}
      <form
        onSubmit={handleManualVerify}
        className="flex flex-col items-center gap-2 w-full max-w-xs"
      >
        <label htmlFor="token" className="font-medium">
          Paste your verification token:
        </label>
        <input
          id="token"
          type="text"
          value={manualToken}
          onChange={(e) => setManualToken(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          placeholder="Enter token here"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded mt-2"
        >
          Verify Token
        </button>
      </form>
    </div>
  );
};

export default Verifyemail;
