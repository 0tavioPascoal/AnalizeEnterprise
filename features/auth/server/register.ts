"use server";

import "server-only";

export interface RegisterInput {
  companyName: string;
  name: string;
  email: string;
  password: string;
}

export async function registerCompany() {
  throw new Error("Cadastro público indisponível.");
}
