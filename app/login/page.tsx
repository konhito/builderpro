"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { useToast } from "@/hooks/useToast";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { success, error: showError, ToastContainer } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const result = await signIn.email({
				email,
				password,
				callbackURL: "/",
			});
			
			console.log("Login result:", result);
			
			// Check if result is a Response object
			if (result instanceof Response) {
				const data = await result.json();
				console.log("Response data:", data);
				
				if (data.error) {
					const errorMessage = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
					showError(errorMessage);
					return;
				}
			} else if (result && typeof result === 'object' && 'error' in result) {
				const errorResult = result as { error: unknown };
				const errorMessage = typeof errorResult.error === 'string' ? errorResult.error : JSON.stringify(errorResult.error);
				showError(errorMessage);
				return;
			}
			
			success("Successfully signed in!");
			// Let the session update naturally, don't force redirect
			window.location.href = "/";
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to sign in. Please check your credentials.";
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
			const errorMessage = err instanceof Error ? err.message : "Failed to sign in with Google. Please try again.";
			showError(errorMessage);
			setLoading(false);
		}
	};

	return (
		<>
			<ToastContainer />
			<div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-8 lg:py-10">
				<div className="text-center mb-6 lg:mb-8">
					<h2 className="brand-tagline">Welcome Back to BuildPro</h2>
					<p className="text-slate-600 mt-2">Sign in to access your account</p>
				</div>

				<section className="rounded-lg bg-white border border-slate-200 shadow-lg p-6 sm:p-8">
					<h3 className="mb-6 text-center text-[24px] font-bold text-blue-700">Sign In</h3>

				<form className="mx-auto max-w-3xl space-y-5" onSubmit={handleSubmit}>
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
						/>
					</div>
					<div className="flex items-center justify-between">
						<label className="inline-flex items-center gap-2 text-sm text-[#4A5762]">
							<input type="checkbox" name="remember" className="h-4 w-4 rounded border-gray-300" disabled={loading} />
							<span>Remember me?</span>
						</label>
						<Link href="#" className="text-sm font-semibold text-[#4A5762] hover:underline">Forgot password?</Link>
					</div>

					<div className="pt-2 space-y-4">
						<button 
							type="submit" 
							className="w-full sm:w-auto inline-flex min-w-[120px] items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white font-semibold hover:from-blue-700 hover:to-blue-800 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
							disabled={loading}
						>
							{loading ? "Signing in..." : "Sign In"}
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
							className="w-full inline-flex items-center justify-center gap-3 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-400 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
							disabled={loading}
						>
							<svg className="h-5 w-5" viewBox="0 0 24 24">
								<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
								<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
								<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
								<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
							</svg>
							{loading ? "Signing in..." : "Sign in with Google"}
						</button>
					</div>
				</form>

					<div className="mt-8 text-center text-sm text-slate-600">
						Don&apos;t have an account?{" "}
						<Link href="/register" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">Create Account</Link>
					</div>
				</section>
			</div>
		</>
	);
}

