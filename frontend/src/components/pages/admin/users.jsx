import React from "react";
import { useListUsers, useUpdateUserRole } from "../../apis/index.js";
import { useAuth } from "../../hooks/use-store.js";
import { Users, Shield, ShieldOff, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminUsers() {
  const { adminToken, userToken } = useAuth();
  const token = userToken || adminToken;
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useListUsers({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const { mutate: updateRole } = useUpdateUserRole();

  const handleRoleToggle = (id, isAdmin) => {
    updateRole({
      id,
      data: { isAdmin: !isAdmin },
      request: { headers: { Authorization: `Bearer ${token}` } }
    }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/users"] })
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      } else {
        alert("Failed to delete user.");
      }
    } catch {
      alert("Error deleting user.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm flex items-center justify-between">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <span className="text-sm text-muted-foreground">{users?.length || 0} total users</span>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : users && users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/50 text-muted-foreground uppercase tracking-wider text-xs border-b border-border">
                <tr>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Joined</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium">{user.email}</td>
                    <td className="p-4 text-muted-foreground">{user.name || "—"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold ${user.isAdmin ? 'bg-accent/10 text-accent' : 'bg-secondary text-muted-foreground'}`}>
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-PK")}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRoleToggle(user.id, user.isAdmin)}
                          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 border transition-colors ${user.isAdmin ? 'border-destructive text-destructive hover:bg-destructive/5' : 'border-accent text-accent hover:bg-accent/5'}`}
                        >
                          {user.isAdmin ? <><ShieldOff className="w-3 h-3" /> Remove Admin</> : <><Shield className="w-3 h-3" /> Make Admin</>}
                        </button>
                        <button
                          onClick={() => handleDelete(String(user.id))}
                          className="flex items-center gap-1 text-xs font-medium px-2 py-1 border border-destructive text-destructive hover:bg-destructive/5 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No users registered yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}