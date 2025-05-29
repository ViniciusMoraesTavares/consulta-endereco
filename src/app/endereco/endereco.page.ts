import { Component, OnInit } from '@angular/core';
import { EnderecoService } from '../services/endereco.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.page.html',
  styleUrls: ['./endereco.page.scss'],
  standalone: false,
})
export class EnderecoPage implements OnInit {

  modoBusca: 'cep' | 'manual' = 'cep';

  // Busca por CEP
  cep = '';
  endereco: any = null;

  // Busca manual
  estados: any[] = [];
  estadoSelecionado = '';
  cidades: any[] = [];
  cidadeSelecionada = '';
  bairro = '';
  logradouro = '';
  numero = '';
  complemento = '';

  // Resultados de CEP ao buscar por endereço
  cepsEncontrados: any[] = [];
  cepSelecionado: string | null = null;

  constructor(
    private enderecoService: EnderecoService,
    private router: Router
  ) {}

  // Função para voltar para a home
  voltarHome() {
    this.router.navigate(['/home']);
  }

  ngOnInit() {
    this.enderecoService.getEstados().subscribe(estados => {
      this.estados = estados.sort((a, b) => a.nome.localeCompare(b.nome));
    });
  }

  // Ao selecionar estado manual, carrega cidades
  carregarCidades() {
    this.cidades = [];
    this.cidadeSelecionada = '';
    if (this.estadoSelecionado) {
      this.enderecoService.getCidadesPorUF(this.estadoSelecionado).subscribe(cidades => {
        this.cidades = cidades;
      });
    }
  }

  // Buscar endereço por CEP
  buscarCep() {
    const cepLimpo = this.cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      this.enderecoService.buscarCep(cepLimpo).subscribe(dados => {
        if (!dados.erro) {
          this.estadoSelecionado = dados.uf;
          this.cidadeSelecionada = dados.localidade;
          this.carregarCidades();

          // Montar objeto com os dados obrigatórios
          const estadoInfo = this.estados.find(e => e.sigla === dados.uf);

          this.endereco = {
            cep: dados.cep,
            logradouro: dados.logradouro,
            complemento: dados.complemento || '',
            bairro: dados.bairro,
            localidade: dados.localidade,
            uf: dados.uf,
            estado: estadoInfo ? estadoInfo.nome : '',
            regiao: estadoInfo ? estadoInfo.regiao.nome : '',
            ibge: dados.ibge
          };

          // Estado e cidade preenchidos e bloqueados
        } else {
          alert('CEP não encontrado');
          this.endereco = null;
          this.estadoSelecionado = '';
          this.cidadeSelecionada = '';
          this.cidades = [];
        }
      });
    } else {
      alert('Digite um CEP válido com 8 números');
    }
  }

  // Buscar CEPs pelo endereço manual (logradouro, bairro, cidade, estado)
  buscarCepPorEndereco() {
    this.cepSelecionado = null;
    this.endereco = null;
    this.cepsEncontrados = [];

    if (!this.estadoSelecionado || !this.cidadeSelecionada || !this.logradouro) {
      alert('Preencha Estado, Cidade e Logradouro para buscar o CEP');
      return;
    }

    const uf = this.estadoSelecionado;
    const cidade = this.cidadeSelecionada;
    const logradouro = this.logradouro;

    this.enderecoService.buscarCepPorEndereco(uf, cidade, logradouro).subscribe(
      (resultados: any[]) => {
        if (!resultados || resultados.length === 0) {
          alert('Nenhum CEP encontrado para esse endereço');
        } else if (resultados.length === 1) {
          this.selecionarCep(resultados[0]);
        } else {
          // Se mais de um resultado, exibe lista para escolha
          this.cepsEncontrados = resultados;
        }
      },
      err => {
        alert('Erro ao buscar CEP pelo endereço');
      }
    );
  }

  // Ao selecionar um CEP da lista, preencher dados do endereço
  selecionarCep(cepData: any) {
    this.cepSelecionado = cepData.cep;
    this.cep = cepData.cep; // Preenche o campo CEP
    this.endereco = {
      cep: cepData.cep,
      logradouro: cepData.logradouro,
      complemento: cepData.complemento || '',
      bairro: cepData.bairro,
      localidade: cepData.localidade,
      uf: cepData.uf,
      estado: this.estados.find(e => e.sigla === cepData.uf)?.nome || '',
      regiao: this.estados.find(e => e.sigla === cepData.uf)?.regiao.nome || '',
      ibge: cepData.ibge
    };
    this.cepsEncontrados = [];
  }

  // Limpa o formulário manual e resultados
  limparBuscaManual() {
    this.estadoSelecionado = '';
    this.cidades = [];
    this.cidadeSelecionada = '';
    this.bairro = '';
    this.logradouro = '';
    this.numero = '';
    this.complemento = '';
    this.cepsEncontrados = [];
    this.cepSelecionado = null;
    this.endereco = null;
  }
}
