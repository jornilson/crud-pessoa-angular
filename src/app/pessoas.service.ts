import { Pessoa } from './models/Pessoa';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
   headers: new HttpHeaders({
     'Content-Type':'application/json'
   })
};

@Injectable({
  providedIn: 'root'
})
export class PessoasService {

  url = 'http://localhost:62913/home';

  constructor(private http:HttpClient) { }

  listarTodos(filtro:string): Observable<Pessoa[]>{
    return this.http.get<Pessoa[]>(this.url+filtro);
  }

  listarPorId(pessoaId:number): Observable<Pessoa>{
    const apiUrl = `${this.url}/${pessoaId}`;
    return this.http.get<Pessoa>(apiUrl);
  }

  salvarPessoa(pessoa:Pessoa) : Observable<any>{
    return this.http.post<Pessoa>(this.url, pessoa, httpOptions);
  }

  excluirPessoa(pessoaId:number) : Observable<any>{
    const apiUrl = `${this.url}/${pessoaId}`;
    return this.http.delete<number>(apiUrl,httpOptions);
  }
}
