import { useState } from "react";
import { cn } from "../../Utils/Cn";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (!username || !password) {
        setError("Please fill in all fields");
      } else {
        console.log("Login:", { username, password });
        alert("Login successful!");
        setUsername("");
        setPassword("");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/75 to-secondary/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Header */}
            <h2 className="card-title text-2xl font-bold text-center mb-6 text-primary">
              Admin Dashboard
            </h2>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-error mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Username</span>
                </label>

                <input
                  type="text"
                  className={cn(
                    "input input-bordered w-full focus:outline-none focus:input-primary",
                    error && "input-error",
                  )}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <input
                  type="password"
                  className={cn(
                    "input input-bordered w-full focus:outline-none focus:input-primary",
                    error && "input-error",
                  )}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <label className="label">
                  <a
                    href="#"
                    className="label-text-alt link link-hover text-primary"
                  >
                    Forgot password?
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "btn btn-primary w-full mt-6",
                  loading && "btn-disabled loading",
                )}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
