import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../api/auth";
import { toast } from "react-toastify";

export default function ChangePasswordPanel({ compact = true }) {
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
    <div className={compact ? "bg-white/30 dark:bg-gray-900/30 p-4 rounded-lg border border-white/20" : ""}>
      <h3 className="text-lg font-semibold mb-3">Change password</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          placeholder="Current password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          className="w-full px-3 py-2 bg-white/60 dark:bg-gray-800/40 border border-gray-300 dark:border-gray-700 rounded"
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          className="w-full px-3 py-2 bg-white/60 dark:bg-gray-800/40 border border-gray-300 dark:border-gray-700 rounded"
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="w-full px-3 py-2 bg-white/60 dark:bg-gray-800/40 border border-gray-300 dark:border-gray-700 rounded"
        />

        <div className="flex justify-end">
          <button type="submit" disabled={mutation.isLoading} className="px-3 py-1 rounded bg-sky-600 text-white">
            {mutation.isLoading ? "Saving..." : "Change"}
          </button>
        </div>
      </form>
    </div>
  );
}
