import { UserRole } from "@/types/user/user";
import { Edit2 } from "lucide-react"; // Ícone de edição
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export function UsersTable({ users }: { users: User[] }) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Usuário</th>
            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">E-mail</th>
            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Nível</th>
            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
              <td className="p-4">
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{user.name}</span>
              </td>
              <td className="p-4">
                <span className="text-sm text-zinc-500 font-medium">{user.email}</span>
              </td>
              <td className="p-4">
                <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                  user.role === 'admin' 
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10' 
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="p-4 text-right">
                <Link 
                  href={`/dashboard/users/edit/${user.id}`}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-400 hover:text-indigo-600 hover:border-indigo-600 transition-all active:scale-90 shadow-sm"
                  title="Editar usuário"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}