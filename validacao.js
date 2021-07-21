
export function validaInput(input) {
    const inputType = input.dataset.type;

    if(validadores[inputType]) {
        validadores[inputType](input);
    }

    if(input.validity.valid) {
        input.parentElement.classList.remove('input-container--error');
        input.parentElement.querySelector('.inputError').innerHTML = '';
       
    } else {
        input.parentElement.classList.add('input-container--error');
        input.parentElement.querySelector('.inputError').innerHTML = showerrormsg(inputType, input);
    }
}

// mensagens de erro

function showerrormsg(inputType, input) {
    var msg = '';
    errorType.forEach(erro => {
        if(input.validity[erro]) [
            msg = errorMsg[inputType][erro]
        ]
    })

    return msg
}

const errorMsg = {
    Senha: {
        valueMissing: 'a senha não pode estar vazia.',
        patternMismatch: 'A senha deve conter, entre 6 a 12 caracteres pelo menos uma letra maiúscula, um número e não deve conter caracteres especiais.'
    },
    dataNasc: {
        customError: 'você precisa ter mais de 18 anos para se cadastrar.',
        valueMissing: 'a Data de Nascimento não pode estar vazia.'
    },
    Nome: {
        valueMissing: 'O Nome não pode estar vazio.',
        patternMismatch: 'Esse campo deve ter no mínimo 10 caracteres e não pode conter números e nem caracteres especiais'
    },
    Cep: {
        valueMissing: 'O Cep não pode estar vazio.',
        patternMismatch: 'O Cep digitado é inválido.',
        customError: 'Cep não encontrado.'
    },
    Cpf: {
        customError: 'Digite um CPF válido.',
        valueMissing: 'O Cpf não pode estar vazio.'
    },
    Email: {
        valueMissing: 'O e-mail não pode estar vazio.',
        typeMismatch: 'O e-mail digitado é invalido.'
    }
}

const errorType = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]

// validando data de nascimento 

const validadores = {
    dataNasc:input => getAge(input),
    Cpf:input => CpfValidity(input),
    Cep:input => validaCep(input)
}

export function getAge(input) {
    var dataNas = new Date(input.value);
    let msg = "";

    if(!check(dataNas)) {
       msg = "você precisa ter mais de 18 anos para se cadastrar."

    }
    input.setCustomValidity(msg);
}

function check(data) {
    const dataAt = new Date()

    const checkAge = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate());
    
    return checkAge <= dataAt;

}


//valiando CPF.


function CpfValidity(input) {
    const cpfFor = input.value.replace(/\D/g, '');
    var msg = ''

    if(!CpfCheckR(cpfFor) || cpfFor.length !== 11 || !cpfVerify(cpfFor)) {
        msg = 'Digite um CPF válido';
    }

    input.setCustomValidity(msg);
}


function CpfCheckR(cpf) {
    const cpfcheckr = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]

    var cpfValid = true;

    cpfcheckr.forEach(value => {
        if(value == cpf) {
            cpfValid = false;
        }
    })

    return cpfValid;
}


function cpfVerify(cpf) {
    const x = 10;

    return checkCPF(cpf, x);
}

function checkCPF(cpf, x) {

    if( x >= 12) {
        return true;
    }

    var sum = 0;
    var xY = x;

    const cpfFrag = cpf.substr(0, x -1).split("");
    const yDigit = cpf.charAt(x - 1);
  
    for(var i = 0; xY > 1; xY--) {
        sum = sum + cpfFrag[i] * xY;

        i++
    }
    
    if(yDigit == cpfConfirm(sum)) {
        return checkCPF(cpf, x +1);
    }

    return false;
}


function cpfConfirm(sum) {
    return 11 - (sum % 11);
}

// validando cep e completando outros campos com API fetch.

function validaCep(input) {
    const cep = input.value.replace(/\D/g, '');

    const url =  `https://viacep.com.br/ws/${cep}/json`;

    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }

    if(!input.validity.patternMismatch && !input.validity.valueMissing) {
        fetch(url,options).then(
            response => response.json()
        ).then(
            data => {
                if(data.erro) {
                    input.setCustomValidity('Cep não encontrado.')
                    return;
                }
                input.setCustomValidity('')
                completeAddres(data)
                return
            }
        )
    }
}


function completeAddres(data) {
    const cidade = document.querySelector('[data-type="Cidade"]')
    const estado = document.querySelector('[data-type="Estado"]')

    cidade.value = data.localidade
    estado.value = data.uf
}
