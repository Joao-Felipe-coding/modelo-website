class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.cpfInput = document.getElementById('cpf');
        this.cepInput = document.getElementById('cep');
        this.telefoneInput = document.getElementById('telefone');
        this.ruaInput = document.getElementById('rua');
        this.bairroInput = document.getElementById('bairro'); // Adicionado campo bairro
        this.cidadeInput = document.getElementById('cidade');
        this.estadoInput = document.getElementById('estado');
        // this.buscarCepButton = document.getElementById('buscar-cep'); // Removido botão de busca de CEP

        this.initMasks();
        this.initValidation();
        this.initCepLookup(); // Adicionado para inicializar a busca de CEP
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

    // Métodos para busca de CEP
    limparFormularioEndereco() {
        if (this.ruaInput) this.ruaInput.value = '';
        if (this.bairroInput) this.bairroInput.value = ''; // Adicionado campo bairro
        if (this.cidadeInput) this.cidadeInput.value = '';
        if (this.estadoInput) this.estadoInput.value = '';
    }

    preencherFormularioEndereco(endereco) {
        if (this.ruaInput) this.ruaInput.value = endereco.logradouro || '';
        if (this.bairroInput) this.bairroInput.value = endereco.bairro || ''; // Adicionado campo bairro
        if (this.cidadeInput) this.cidadeInput.value = endereco.localidade || '';
        if (this.estadoInput) this.estadoInput.value = endereco.uf || '';
    }

    _eNumero(numero) {
        return /^[0-9]+$/.test(numero);
    }

    _cepValido(cep) {
        const cepLimpo = cep.replace(/\D/g, '');
        return cepLimpo.length === 8 && this._eNumero(cepLimpo);
    }

    async pesquisarCep() {
        this.limparFormularioEndereco();
        // Limpar erros de CEP e dos campos de endereço relacionados ao CEP ANTES da busca
        this.clearError('cep-error');
        this.clearError('rua-error');
        this.clearError('bairro-error');
        this.clearError('cidade-error');
        this.clearError('estado-error');

        const cepValue = this.cepInput.value;

        if (this._cepValido(cepValue)) {
            const cepLimpo = cepValue.replace(/\D/g, ''); // Corrigido para /\D/g
            const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
            try {
                // Opcional: Mostrar mensagem de carregamento
                // this.showError('cep-error', 'Buscando CEP...');
                const response = await fetch(url);
                const address = await response.json();

                if (Object.prototype.hasOwnProperty.call(address, 'erro')) {
                    this.showError('cep-error', 'CEP não encontrado.');
                    this.limparFormularioEndereco();
                } else {
                    this.preencherFormularioEndereco(address);
                    this.clearError('cep-error'); // Limpa 'Buscando CEP...' ou qualquer erro anterior de CEP
                    // A validação dos campos preenchidos (rua, bairro, etc.) ocorrerá no submit.
                    // Apenas garantimos que, se a API preencheu, os erros antigos desses campos sejam limpos.
                    this.validateField(this.ruaInput, 'rua-error', '', value => value.trim().length >= 3);
                    this.validateField(this.bairroInput, 'bairro-error', '', value => value.trim().length >= 3);
                    this.validateField(this.cidadeInput, 'cidade-error', '', value => value.trim().length >= 3);
                    this.validateField(this.estadoInput, 'estado-error', '', value => value !== '');
                }
            } catch (error) {
                this.showError('cep-error', 'Erro ao buscar CEP. Tente novamente.');
                this.limparFormularioEndereco();
            }
        } else if (cepValue.trim() !== '') {
            this.showError('cep-error', 'Formato de CEP inválido.');
            this.limparFormularioEndereco();
        } else {
            // Se o campo CEP estiver vazio e perder o foco (blur),
            // limpa qualquer erro de CEP que possa estar lá (ex: "Formato inválido" de uma digitação anterior).
            this.clearError('cep-error');
        }
    }

    initCepLookup() {
        if (this.cepInput) {
            // Dispara a busca de CEP quando o campo perde o foco (blur)
            this.cepInput.addEventListener('blur', () => this.pesquisarCep());
        }
        // O botão de buscar CEP foi removido, então não precisamos mais do event listener para ele.
    }

    // Método auxiliar para validação de campo individual (usado após preenchimento por API)
    validateField(inputElement, errorElementId, errorMessage, validationFn) {
        if (inputElement) {
            if (validationFn(inputElement.value)) {
                this.clearError(errorElementId);
                return true;
            } else {
                // Só mostra erro se o campo não estiver vazio e for inválido, 
                // ou se for um campo obrigatório que está vazio.
                // Para campos preenchidos pela API, queremos limpar o erro se válido.
                if (inputElement.value.trim() !== '' || inputElement.required) {
                    // Não mostra erro aqui automaticamente, deixa para o submit geral,
                    // exceto se quisermos feedback imediato após API.
                    // Por ora, apenas limpamos se válido.
                }
                return false;
            }
        }
        return true; // Se o elemento não existir, considera válido para não quebrar
    }


    initValidation() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Validar nome
            const nomeInput = document.getElementById('nome');
            if (nomeInput.value.trim().length < 3) {
                this.showError('nome-error', 'Por favor, insira um nome válido');
                isValid = false;
            } else {
                this.clearError('nome-error');
            }

            // Validar telefone
            const telefoneValue = this.telefoneInput.value;
            if (telefoneValue.replace(/\D/g, '').length < 10) {
                this.showError('telefone-error', 'Por favor, insira um telefone válido');
                isValid = false;
            } else {
                this.clearError('telefone-error');
            }

            // Validar CPF
            const cpfValue = this.cpfInput.value;
            if (!this.validarCPF(cpfValue)) {
                this.showError('cpf-error', 'Por favor, insira um CPF válido');
                isValid = false;
            } else {
                this.clearError('cpf-error');
            }

            // Validar CEP
            const cepValueSubmit = this.cepInput.value.trim();
            const cepErrorSpanOnSubmit = document.getElementById('cep-error');

            if (cepValueSubmit === '') {
                this.showError('cep-error', 'Por favor, insira o CEP.');
                isValid = false;
            } else if (!this._cepValido(cepValueSubmit)) {
                // Se o formato é inválido. A função pesquisarCep no blur já deve ter setado 'Formato de CEP inválido.'
                // Esta é uma checagem de segurança no submit.
                // Só mostra o erro se não houver um erro mais específico já presente (ex: "CEP não encontrado").
                if (!cepErrorSpanOnSubmit.textContent) {
                    this.showError('cep-error', 'Formato de CEP inválido.');
                }
                isValid = false;
            } else if (cepErrorSpanOnSubmit && cepErrorSpanOnSubmit.textContent !== '') {
                // Se o span de erro do CEP já tem alguma mensagem (ex: "CEP não encontrado", "Erro ao buscar CEP", "Formato de CEP inválido" do blur)
                // isso indica que a lógica do blur (pesquisarCep) detectou um problema que impede a submissão.
                isValid = false;
            } else {
                // CEP está preenchido, tem formato válido, e não há mensagem de erro no span.
                // Implica que a API funcionou ou o usuário preencheu manualmente e os campos de endereço serão validados a seguir.
                this.clearError('cep-error'); // Garante a limpeza se tudo estiver ok neste ponto para o CEP.
            }


            // Validar rua
            const ruaValue = this.ruaInput.value;
            if (ruaValue.trim().length < 3) {
                this.showError('rua-error', 'Por favor, insira uma rua válida');
                isValid = false;
            } else {
                this.clearError('rua-error');
            }

            // Validar número
            const numeroInput = document.getElementById('numero');
            if (numeroInput.value.trim() === '') {
                this.showError('numero-error', 'Por favor, insira um número');
                isValid = false;
            } else {
                this.clearError('numero-error');
            }

            // Validar bairro
            if (this.bairroInput) { // Verifica se o campo bairro existe
                const bairroValue = this.bairroInput.value;
                if (bairroValue.trim().length < 3) {
                    this.showError('bairro-error', 'Por favor, insira um bairro válido');
                    isValid = false;
                } else {
                    this.clearError('bairro-error');
                }
            }

            // Validar cidade
            const cidadeValue = this.cidadeInput.value;
            if (cidadeValue.trim().length < 3) {
                this.showError('cidade-error', 'Por favor, insira uma cidade válida');
                isValid = false;
            } else {
                this.clearError('cidade-error');
            }

            // Validar estado
            const estadoValue = this.estadoInput.value;
            if (estadoValue === '') {
                this.showError('estado-error', 'Por favor, selecione um estado');
                isValid = false;
            } else {
                this.clearError('estado-error');
            }

            // A checagem redundante de cepErrorSpan foi removida, pois a lógica de validação do CEP acima já a cobre.
            // if (isValid) {
            // // Verifica se há alguma mensagem de erro pendente da busca de CEP
            // const cepErrorSpan = document.getElementById('cep-error');
            // if (cepErrorSpan && cepErrorSpan.textContent !== '') {
            // isValid = false;
            // }
            // }

            if (isValid) {
                alert('Cadastro realizado com sucesso!');
                this.form.reset();
                this.limparFormularioEndereco(); // Limpa campos de endereço também
                // Limpar todos os erros
                ['nome-error', 'telefone-error', 'cpf-error', 'cep-error', 'rua-error', 'numero-error', 'bairro-error', 'cidade-error', 'estado-error'].forEach(id => this.clearError(id)); // Adicionado 'bairro-error'
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FormValidator('cadastro-form');
});
