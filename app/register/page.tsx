"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { useToast } from "@/hooks/useToast";

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { success, error: showError, warning, ToastContainer } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		if (password !== confirmPassword) {
			warning("Passwords do not match. Please try again.");
			setLoading(false);
			return;
		}

		if (password.length < 8) {
			warning("Password must be at least 8 characters long.");
			setLoading(false);
			return;
		}

		try {
			await signUp.email({
				email,
				password,
				name,
				callbackURL: "/",
			});
			success("Account created successfully! Redirecting...");
			setTimeout(() => router.push("/"), 1000);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to create account. This email may already be registered.";
			showError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setLoading(true);

		try {
			await signIn.social({
				provider: "google",
				callbackURL: "/",
			});
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to sign up with Google. Please try again.";
			showError(errorMessage);
			setLoading(false);
		}
	};

	return (
		<>
			<ToastContainer />
			<div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-8 lg:py-10">
				<div className="text-center mb-6 lg:mb-8">
					<h2 className="brand-tagline">Join BuildPro Today</h2>
					<p className="text-slate-600 mt-2">Create an account to access professional supplies</p>
				</div>

				<section className="rounded-lg bg-white border border-slate-200 shadow-lg p-6 sm:p-8">
					<h3 className="mb-6 text-center text-[24px] font-bold text-blue-700">Create Account</h3>

				<form className="mx-auto max-w-3xl space-y-5" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="name" className="mb-1 block text-sm font-semibold text-[#4A5762]">Full Name:</label>
						<input
							id="name"
							name="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-[14px] text-[#333] focus:outline-none focus:ring-2 focus:ring-[#DA291C]"
							placeholder="John Doe"
							required
							disabled={loading}
						/>
					</div>
					<div>
						<label htmlFor="email" className="mb-1 block text-sm font-semibold text-[#4A5762]">Email:</label>
						<input
							id="email"
							name="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-[14px] text-[#333] focus:outline-none focus:ring-2 focus:ring-[#DA291C]"
							placeholder="your@email.com"
							required
							disabled={loading}
						/>
					</div>
					<div>
						<label htmlFor="password" className="mb-1 block text-sm font-semibold text-[#4A5762]">Password:</label>
						<input
							id="password"
							name="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-[14px] text-[#333] focus:outline-none focus:ring-2 focus:ring-[#DA291C]"
							placeholder="••••••••"
							required
							disabled={loading}
							minLength={8}
						/>
						<p className="mt-1 text-xs text-[#4A5762]">Must be at least 8 characters</p>
					</div>
					<div>
						<label htmlFor="confirmPassword" className="mb-1 block text-sm font-semibold text-[#4A5762]">Confirm Password:</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-[14px] text-[#333] focus:outline-none focus:ring-2 focus:ring-[#DA291C]"
							placeholder="••••••••"
							required
							disabled={loading}
						/>
					</div>

					<div className="pt-2 space-y-4">
						<button 
							type="submit" 
							className="w-full sm:w-auto inline-flex min-w-[120px] items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white font-semibold hover:from-blue-700 hover:to-blue-800 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
							disabled={loading}
						>
							{loading ? "Creating account..." : "Create Account"}
						</button>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-[#EEEEEE] text-[#4A5762]">Or continue with</span>
							</div>
						</div>

						<button
							type="button"
							onClick={handleGoogleSignIn}
							className="w-full inline-flex items-center justify-center gap-3 rounded border-2 border-gray-300 bg-white px-6 py-3 text-[#333] font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={loading}
						>
							<svg className="h-5 w-5" viewBox="0 0 24 24">
								<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
								<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
								<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
								<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
							</svg>
							{loading ? "Signing up..." : "Sign up with Google"}
						</button>
					</div>
				</form>

					<div className="mt-8 text-center text-sm text-slate-600">
						Already have an account?{" "}
						<Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">Sign In</Link>
					</div>
				</section>
			</div>
		</>
	);
}
