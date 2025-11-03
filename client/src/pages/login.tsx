import { useRepos } from "@/context/ReposContext";
import { Github } from "lucide-react";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { handleLoginWithGithub } = useRepos();

  const login = async () => {
    const result = await handleLoginWithGithub();
    if (result.success) {
      return <Navigate to={"/user"} />;
    } else {
      return <Navigate to={"/"} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all duration-300 hover:scale-[1.02]">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300 text-sm">
              Sign in to continue to your account
            </p>
          </div>

          {/* GitHub Login Button */}
          <button
            onClick={login}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] border border-gray-700"
          >
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-300">Or</span>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <button className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 border border-white/10">
              Create Account
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-xs">
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Terms of Service
              </a>
            </p>
          </div>
        </div>

        {/* Extra decoration */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
