import { Address } from "@/types/address";

const API_URL = "https://viacep.com.br/ws/";

export async function getAdress(cep: string): Promise<Address> {
  const response = await fetch(`${API_URL}/${cep}/json`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch address");
  }

  const data = await response.json();

  if (data.erro) {
    throw new Error("Failed to fetch address");
  }

  return {
    cep: data.cep,
    road: data.logradouro,
    number: "",
    complement: "",
    neighborhood: data.bairro,
    city: data.localidade,
    state: data.estado,
  };
}
