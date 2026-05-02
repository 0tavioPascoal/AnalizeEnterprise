"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  company: string;
};

const FIXED_COMPANY = "ACME Ltda";

const initialUsers: User[] = [
  { id: "1", name: "João Silva", email: "joao@empresa.com", company: FIXED_COMPANY },
  { id: "2", name: "Maria Souza", email: "maria@empresa.com", company: FIXED_COMPANY },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  // create
  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // edit
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  function createUser() {
    if (!name || !email || !password) return;

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      company: FIXED_COMPANY,
    };

    setUsers((prev) => [newUser, ...prev]);

    setName("");
    setEmail("");
    setPassword("");
    setOpenCreate(false);
  }

  function openEditModal(user: User) {
    setSelectedUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setOpenEdit(true);
  }

  function saveEdit() {
    if (!selectedUser) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, name: editName, email: editEmail }
          : u
      )
    );

    setOpenEdit(false);
    setSelectedUser(null);
  }

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Usuários</h1>

        <Button onClick={() => setOpenCreate(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Novo usuário
        </Button>
      </div>

      {/* LISTA */}
      <div className="grid gap-2">
        {users.map((user) => (
          <Card
            key={user.id}
            className="p-3 flex justify-between cursor-pointer hover:bg-muted transition"
            onClick={() => openEditModal(user)}
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>

            <span className="text-xs text-muted-foreground">
              {user.company}
            </span>
          </Card>
        ))}
      </div>

      {/* MODAL CREATE */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar usuário</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <Input value={FIXED_COMPANY} disabled />

            <Input
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button className="w-full" onClick={createUser}>
              Criar usuário
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL EDIT */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar usuário</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <Input value={FIXED_COMPANY} disabled />

            <Input
              placeholder="Nome"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <Input
              placeholder="Email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />

            <Button className="w-full" onClick={saveEdit}>
              Salvar alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
