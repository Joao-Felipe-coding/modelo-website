class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.cpfInput = document.getElementById('cpf');
        this.cepInput = document.getElementById('cep');
        this.telefoneInput = document.getElementById('telefone');
        this.initMasks();
        this.initValidation();
    }

    formatCPF(cpf) {
        return cpf
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    }

    formatCEP(cep) {
        return cep
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1');
    }

    formatTelefone(telefone) {
        return telefone
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    }

    validarCPF(cpfParam) {
        const cpf = cpfParam.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let soma = 0;
        let resto;
        for (let i = 1; i <= 9; i++) {
            soma += Number.parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== Number.parseInt(cpf.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += Number.parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== Number.parseInt(cpf.substring(10, 11))) return false;
        return true;
    }

    initMasks() {
        if (this.cpfInput) {
            this.cpfInput.addEventListener('input', (e) => {
                this.cpfInput.value = this.formatCPF(this.cpfInput.value);
            });
        }
        if (this.cepInput) {
            this.cepInput.addEventListener('input', (e) => {
                this.cepInput.value = this.formatCEP(this.cepInput.value);
            });
        }
        if (this.telefoneInput) {
            this.telefoneInput.addEventListener('input', (e) => {
                this.telefoneInput.value = this.formatTelefone(this.telefoneInput.value);
            });
        }
    }

    showError(id, message) {
        const el = document.getElementById(id);
        if (el) el.textContent = message;
    }

    clearError(id) {
        this.showError(id, '');
    }

    initValidation() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Validar nome
            const nome = document.getElementById('nome').value;
            if (nome.trim().length < 3) {
                this.showError('nome-error', 'Por favor, insira um nome válido');
                isValid = false;
            } else {
                this.clearError('nome-error');
            }

            // Validar telefone
            const telefone = this.telefoneInput.value;
            if (telefone.replace(/\D/g, '').length < 10) {
                this.showError('telefone-error', 'Por favor, insira um telefone válido');
                isValid = false;
            } else {
                this.clearError('telefone-error');
            }

            // Validar CPF
            const cpf = this.cpfInput.value;
            if (!this.validarCPF(cpf)) {
                this.showError('cpf-error', 'Por favor, insira um CPF válido');
                isValid = false;
            } else {
                this.clearError('cpf-error');
            }

            // Validar CEP
            'use strict'; //modo restrito

            //valida se o CEP é valido
            const eNumero = (numero) => /^[0-9]+$/.test(numero);
            const cepValido = (cep) => cep.length === 8 && eNumero(cep);

            const pesquisaCep = async () => {
                limparFormulario();
                const url = `HTTP://viacep.com.br/ws/${cep.value}/json/`;
                
            }

            //função de limpeza do form
            limparFormulario = () => {
                document.getElementById('rua').value = '';
                document.getElementById('bairro').value = '';
                document.getElementById('cidade').value = '';
                document.getElementById('estado').value = '';
            }

             

            // Validar rua
            const rua = document.getElementById('rua').value;
            if (rua.trim().length < 3) {
                this.showError('rua-error', 'Por favor, insira uma rua válida');
                isValid = false;
            } else {
                this.clearError('rua-error');
            }

            // Validar número
            const numero = document.getElementById('numero').value;
            if (numero.trim() === '') {
                this.showError('numero-error', 'Por favor, insira um número');
                isValid = false;
            } else {
                this.clearError('numero-error');
            }

            // Validar cidade
            const cidade = document.getElementById('cidade').value;
            if (cidade.trim().length < 3) {
                this.showError('cidade-error', 'Por favor, insira uma cidade válida');
                isValid = false;
            } else {
                this.clearError('cidade-error');
            }

            // Validar estado
            const estado = document.getElementById('estado').value;
            if (estado === '') {
                this.showError('estado-error', 'Por favor, selecione um estado');
                isValid = false;
            } else {
                this.clearError('estado-error');
            }

            if (isValid) {
                alert('Cadastro realizado com sucesso!');
                this.form.reset();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FormValidator('cadastro-form');
});
