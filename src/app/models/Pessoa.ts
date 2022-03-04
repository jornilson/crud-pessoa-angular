import { Telefone } from "./Telefone";
export class Pessoa{
    id: number;
    nome: string;
    razao: string;
    pfj: number;
    cpf: string;
    cep: string;
    email: string;
    classificacao: number;
    cnpjCpf: string;
    telefones: Telefone[]
}