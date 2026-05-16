import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../api/auth";
import { toast } from "react-toastify";
import ProgressBar from "../../components/ui/ProgressBar";
import { Link } from "react-router-dom";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: (payload) => changePassword(payload),
    onSuccess: () => {
      toast.success("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err) => {
      const msg = err?.response?.data || err?.message || "Failed to change password";
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    mutation.mutate({ old_password: oldPassword, new_password: newPassword, new_password2: confirmPassword });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-all p-8">
      <ProgressBar apiLoading={mutation.isLoading} />

      <div className="max-w-xl mx-auto bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 rounded-2xl shadow-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Enter your current password and choose a new secure password.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/40 border border-gray-300 dark:border-gray-700 rounded focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/40 border border-gray-300 dark:border-gray-700 rounded focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/40 border border-gray-300 dark:border-gray-700 rounded focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link to="/dashboard/profile" className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">Cancel</Link>
            <button type="submit" className="px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-70" disabled={mutation.isLoading}> {mutation.isLoading ? 'Saving...' : 'Change password'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
