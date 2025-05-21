document.addEventListener('DOMContentLoaded', function() {
    // Funções de formatação e validação
    const formatCPF = (cpf) => {
        return cpf
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const formatCEP = (cep) => {
        return cep
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1');
    };

    const formatTelefone = (telefone) => {
        return telefone
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    const validarCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0;
        let resto;

        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;

        return true;
    };

    // Aplicar máscara aos campos
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            this.value = formatCPF(this.value);
        });
    }

    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            this.value = formatCEP(this.value);
        });
    }

    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            this.value = formatTelefone(this.value);
        });
    }

    // Buscar CEP
    const buscarCEP = document.getElementById('buscar-cep');
    if (buscarCEP) {
        buscarCEP.addEventListener('click', function() {
            const cep = cepInput.value.replace(/\D/g, '');
            
            if (cep.length !== 8) {
                document.getElementById('cep-error').textContent = 'CEP inválido';
                return;
            }

            document.getElementById('cep-error').textContent = '';
            
            // Simular busca de CEP (em produção, seria uma chamada de API real)
            // Como exemplo, preenchemos com dados fictícios
            setTimeout(() => {
                document.getElementById('rua').value = 'Avenida Paulista';
                document.getElementById('cidade').value = 'São Paulo';
                document.getElementById('estado').value = 'SP';
                // Foca no campo de número após preencher o endereço
                document.getElementById('numero').focus();
            }, 1000);
        });
    }

    // Validação do formulário no envio
    const form = document.getElementById('cadastro-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            // Validar nome
            const nome = document.getElementById('nome').value;
            if (nome.trim().length < 3) {
                document.getElementById('nome-error').textContent = 'Por favor, insira um nome válido';
                isValid = false;
            } else {
                document.getElementById('nome-error').textContent = '';
            }

            // Validar telefone
            const telefone = document.getElementById('telefone').value;
            if (telefone.replace(/\D/g, '').length < 10) {
                document.getElementById('telefone-error').textContent = 'Por favor, insira um telefone válido';
                isValid = false;
            } else {
                document.getElementById('telefone-error').textContent = '';
            }

            // Validar CPF
            const cpf = document.getElementById('cpf').value;
            if (!validarCPF(cpf)) {
                document.getElementById('cpf-error').textContent = 'Por favor, insira um CPF válido';
                isValid = false;
            } else {
                document.getElementById('cpf-error').textContent = '';
            }

            // Validar CEP
            const cep = document.getElementById('cep').value;
            if (cep.replace(/\D/g, '').length !== 8) {
                document.getElementById('cep-error').textContent = 'Por favor, insira um CEP válido';
                isValid = false;
            } else {
                document.getElementById('cep-error').textContent = '';
            }

            // Validar rua
            const rua = document.getElementById('rua').value;
            if (rua.trim().length < 3) {
                document.getElementById('rua-error').textContent = 'Por favor, insira uma rua válida';
                isValid = false;
            } else {
                document.getElementById('rua-error').textContent = '';
            }

            // Validar número
            const numero = document.getElementById('numero').value;
            if (numero.trim() === '') {
                document.getElementById('numero-error').textContent = 'Por favor, insira um número';
                isValid = false;
            } else {
                document.getElementById('numero-error').textContent = '';
            }

            // Validar cidade
            const cidade = document.getElementById('cidade').value;
            if (cidade.trim().length < 3) {
                document.getElementById('cidade-error').textContent = 'Por favor, insira uma cidade válida';
                isValid = false;
            } else {
                document.getElementById('cidade-error').textContent = '';
            }

            // Validar estado
            const estado = document.getElementById('estado').value;
            if (estado === '') {
                document.getElementById('estado-error').textContent = 'Por favor, selecione um estado';
                isValid = false;
            } else {
                document.getElementById('estado-error').textContent = '';
            }

            if (isValid) {
                // Em um caso real, aqui você enviaria os dados para o servidor
                alert('Cadastro realizado com sucesso!');
                form.reset();
            }
        });
    }
});
