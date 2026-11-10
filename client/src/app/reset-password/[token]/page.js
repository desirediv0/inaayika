"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
    const { token } = useParams();
    const router = useRouter();
    const { resetPassword, loading } = useAuth();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);
        try {
            await resetPassword(token, password);
            toast.success("Password reset successfully. Please sign in.");
            router.push("/auth?tab=login");
        } catch (requestError) {
            const message = requestError.message || "Unable to reset your password.";
            setError(message);
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-semibold mb-2">Reset Password</h1>
                <p className="text-sm text-muted-foreground mb-6">
                    Choose a new password for your account.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            New password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm new password
                        </label>
                        <Input
                            id="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                    </div>
                    <p className="text-xs text-gray-500">
                        Use at least 8 characters, including uppercase and lowercase letters, a number, and a special character.
                    </p>
                    {error && (
                        <p role="alert" className="text-sm text-red-600">
                            {error}
                        </p>
                    )}
                    <Button
                        type="submit"
                        disabled={submitting || loading}
                        className="w-full text-white bg-[#003E29] hover:bg-[#002216] font-semibold py-3 h-auto rounded-xl"
                    >
                        {submitting || loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
                <div className="mt-4 text-sm">
                    <Link href="/auth?tab=login" className="text-primary hover:underline">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
