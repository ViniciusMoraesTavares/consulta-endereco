import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {

  private apiEstados = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
  private apiCidades = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
  private apiCep = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  getEstados(): Observable<any[]> {
    return this.http.get<any[]>(this.apiEstados);
  }

  getCidadesPorUF(uf: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiCidades}/${uf}/municipios`);
  }

  buscarCep(cep: string): Observable<any> {
    return this.http.get<any>(`${this.apiCep}/${cep}/json/`);
  }

  buscarCepPorEndereco(uf: string, cidade: string, logradouro: string): Observable<any[]> {
    const url = `${this.apiCep}/${uf}/${encodeURIComponent(cidade)}/${encodeURIComponent(logradouro)}/json/`;
    return this.http.get<any[]>(url);
  }
}
