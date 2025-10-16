import { useAuth } from "../hooks/useAuth";
import AuthForm from "../components/AuthForm";
import Layout from "../components/Layout";
import NavBar from "../components/NavBar";

const LoginPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-brand-orange"></div>
        </div>
      </Layout>
    );
  }

  // If user is already logged in, redirect to home
  if (user) {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <NavBar />

      <div className="pt-24 pb-20">
        <div className="max-w-md px-4 mx-auto">
          {/* Logo and Title */}
          <div className="mb-12 text-center">
            {/* Abstract Logo */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6"></div>

            <h1 className="text-2xl font-medium text-text-primary">
              Sign in to EmojiCharades
            </h1>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
