import { PessoasService } from './../../pessoas.service';
import { Pessoa } from './../../models/Pessoa';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css']
})
export class PessoasComponent implements OnInit {

  formulario:any;
  pessoas:Pessoa[];
  idPessoa:number;
  modalRef:BsModalRef;
  msgRetorno:string;
  mostrarMsgErroModal:boolean;
  mostrarMsgSucesso:boolean;
  skills = new FormArray([]);

  constructor(private pessoasService: PessoasService, private modalService: BsModalService,private fb:FormBuilder) { }

  ngOnInit(): void {

    this.mostrarMsgSucesso = false;
    this.Listar();
  }

  EnviarFormulario(): void{

    this.mostrarMsgErroModal = false;
    this.mostrarMsgSucesso = false;
    const pessoa : Pessoa = this.formulario.value;

    this.pessoasService.salvarPessoa(pessoa).subscribe(resultado => {    
      this.Listar();  
      this.ValidarRetornoEnviarFormulario(resultado);      
    });
  }

  ValidarRetornoEnviarFormulario(retorno): void{

    this.msgRetorno = retorno.msgRetorno;   

     if(!retorno.status){
      
      if(retorno.listaErroEntidade != null){
        retorno.listaErroEntidade.forEach(element => {    
          this.formulario.controls[element.campo].status = 'INVALID';
        });
      }

      this.mostrarMsgErroModal = true;
     }
     else{
      this.mostrarMsgSucesso = true;
      this.modalRef.hide();
     }
  }

  FiltrarPorPfj(event: any): void{

    let pfj = event.target.value;
    let filtro = '?pfj='+pfj;
    this.Listar(filtro);
  }

  Listar(filtro = ''): void{    
    this.pessoasService.listarTodos(filtro).subscribe(resultado => {
      this.pessoas = resultado;      
    });
  }

  Criar(conteudoModal:TemplateRef<any>): void{

    this.modalRef = this.modalService.show(conteudoModal);
    this.mostrarMsgErroModal = false;
    this.mostrarMsgSucesso = false;

    this.formulario = new FormGroup({
      id:new FormControl(0),
      nome:new FormControl(''),
      razao:new FormControl(''),
      pfj:new FormControl('0'),
      cep:new FormControl(''),
      email:new FormControl(''),
      classificacao:new FormControl(1),
      cnpjCpf:new FormControl(''),
      telefones: new FormArray([]),
    });
  }

  get telefones():FormArray  {
    return this.formulario.get('telefones') as FormArray;
  } 

  newTelefone(id, numero): FormGroup {
    return this.fb.group({
      id: id,
      numero: numero,
    })
 }

  addCampoTelefone(id = 0, numero = '') {
    this.telefones.push(this.newTelefone(id,numero));
  }

  Editar(id:number, conteudoModal:TemplateRef<any>): void{
    
    this.mostrarMsgErroModal = false;
    this.mostrarMsgSucesso = false;
    this.pessoasService.listarPorId(id).subscribe(resultado => {

      this.formulario = new FormGroup({
        id:new FormControl(resultado.id),
        nome:new FormControl(resultado.nome),
        razao:new FormControl(resultado.razao),
        pfj:new FormControl(resultado.pfj),
        cep:new FormControl(resultado.cep),
        email:new FormControl(resultado.email),
        classificacao:new FormControl(resultado.classificacao),
        cnpjCpf:new FormControl(resultado.cnpjCpf),
        telefones: new FormArray([]),
      });
      
      this.modalRef = this.modalService.show(conteudoModal);

      if(resultado.telefones != null){
            resultado.telefones.forEach(element => {                
                this.addCampoTelefone(element.id, element.numero);
            });
      }      
    });
  }

  AbrirModalConfirmaExcluir(id:number, conteudoModal:TemplateRef<any>): void{
    
    this.mostrarMsgSucesso = false;
    this.modalRef = this.modalService.show(conteudoModal);
    this.idPessoa = id;
  }

  Excluir(): void{
    
    this.mostrarMsgErroModal = false;
    this.mostrarMsgSucesso = false;
    this.pessoasService.excluirPessoa(this.idPessoa).subscribe(resultado => {
      this.modalRef.hide();
      this.Listar(); 
    });
  }


  ObterDescricaoSituacao(situacao): string{
    if(situacao === 0){
      return 'Inativo';
    }
    else if(situacao === 1){
      return 'Ativo';
    }
    else{
      return 'Preferencial';
    }
  }

}
