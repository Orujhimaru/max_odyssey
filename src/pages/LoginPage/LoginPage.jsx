import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { signUp, signIn, signInWithOAuth, isAuthenticated, user } = useAuth();

  // Check if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!isValidPassword(password)) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (isSignUp && !fullName.trim()) {
      setError("Please enter your full name");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const result = await signUp(email, password, fullName);
        if (result.success) {
          setError("Please check your email to confirm your account");
        } else {
          setError(result.error);
        }
      } else {
        const result = await signIn(email, password);
        if (result.success) {
          navigate("/dashboard");
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithOAuth("google");
      if (!result.success) {
        setError(result.error);
      }
      // Note: For OAuth, the user will be redirected, so we don't handle success here
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-pattern"></div>
      </div>

      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="logo-text">MaxSAT</span>
          </div>
          <h1 className="login-title">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="login-subtitle">
            {isSignUp
              ? "Start your SAT preparation journey"
              : "Sign in to continue your SAT prep"}
          </p>
        </div>

        {error && (
          <div
            className={`message ${
              error.includes("check your email") ? "success" : "error"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              {error.includes("check your email") ? (
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSignIn} className="login-form">
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required={isSignUp}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  {showPassword ? (
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.39 1 12A18.45 18.45 0 0 1 5.06 5.06M9.9 4.24A9.12 9.12 0 0 1 12 4C17 4 21.27 7.61 23 12A18.5 18.5 0 0 1 19.42 16.42M14.12 14.12A3 3 0 1 1 9.88 9.88M1 1L23 23"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z M12 9A3 3 0 1 1 12 15A3 3 0 0 1 12 9Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required={isSignUp}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    {showConfirmPassword ? (
                      <path
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.39 1 12A18.45 18.45 0 0 1 5.06 5.06M9.9 4.24A9.12 9.12 0 0 1 12 4C17 4 21.27 7.61 23 12A18.5 18.5 0 0 1 19.42 16.42M14.12 14.12A3 3 0 1 1 9.88 9.88M1 1L23 23"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <path
                        d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z M12 9A3 3 0 1 1 12 15A3 3 0 0 1 12 9Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="32"
                    strokeDashoffset="32"
                  >
                    <animate
                      attributeName="stroke-dasharray"
                      dur="2s"
                      values="0 32;16 16;0 32;0 32"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-dashoffset"
                      dur="2s"
                      values="0;-16;-32;-32"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              </div>
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="auth-button google"
          disabled={loading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.93 16.82 15.86 17.61V20.34H19.34C21.34 18.52 22.56 15.64 22.56 12.25Z"
              fill="#4285F4"
            />
            <path
              d="M12 23C15.24 23 17.95 21.92 19.34 20.34L15.86 17.61C14.95 18.25 13.78 18.64 12 18.64C8.87 18.64 6.22 16.8 5.4 14.19H1.81V17.01C3.19 19.76 7.36 23 12 23Z"
              fill="#34A853"
            />
            <path
              d="M5.4 14.19C5.18 13.55 5.05 12.86 5.05 12.14C5.05 11.42 5.18 10.73 5.4 10.09V7.27H1.81C1.08 8.73 0.67 10.37 0.67 12.14C0.67 13.91 1.08 15.55 1.81 17.01L5.4 14.19Z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38C13.93 5.38 15.66 6.05 16.98 7.3L20.09 4.19C17.95 2.19 15.24 1 12 1C7.36 1 3.19 4.24 1.81 6.99L5.4 9.81C6.22 7.2 8.87 5.38 12 5.38Z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className="auth-switch">
          <span>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </span>
          <button
            type="button"
            onClick={toggleAuthMode}
            className="auth-switch-button"
            disabled={loading}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>

        {!isSignUp && (
          <div className="forgot-password">
            <button
              type="button"
              className="forgot-password-button"
              onClick={() => {
                // TODO: Implement forgot password with Supabase
                console.log("Forgot password clicked");
                setError("Password reset functionality coming soon!");
              }}
            >
              Forgot your password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
