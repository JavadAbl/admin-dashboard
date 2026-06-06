import { useState } from "react";
import { cn } from "../../Utils/Cn";
import { useAuthAction } from "../../Features/Auth/AuthApi";
import { useAppDispatch } from "../../Hooks/ReduxHooks";
import { authActions } from "../../Features/Auth/AuthSlice";
import { storage } from "../../Utils/Storage";
import { toast } from "sonner";

export default function LoginPage() {
  const dis = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { mutate: mutateAuthAction, isPending: loading } = useAuthAction();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    mutateAuthAction(
      { username, password },
      {
        onSuccess: (res) => {
          const { accessToken, refreshToken, user } = res.data;
          storage.setTokens(accessToken, refreshToken);
          dis(authActions.login({ user }));
          toast.success("Login successful!");
        },
      },
    );
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
                className={cn(
                  "w-full btn btn-primary mt-6",
                  loading && "btn-disabled",
                )}
              >
                {!loading ? (
                  "Sign In"
                ) : (
                  <span className={cn("loading loading-dots")} />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
