import methodsValidate from './methodsValidate'

const MyForm = {
    validate: () => ({
        isValid: 'Boolean',
        errorFields: 'String',
    }),

    submit: () => undefined,
}

document.addEventListener('DOMContentLoaded', () => {
    const elementsName = ['fio', 'phone', 'email']
    const elements = document.forms["myForm"].elements
    const submit = document.getElementById('submitButton')
    const form = document.getElementById('myForm')
    const result = document.getElementById('resultContainer')

    MyForm.getData = getData
    MyForm.setData = setData
    MyForm.validate = validate

    function getData(elements) {
        const elementForm = {}
        for (let i = 0; i < elements.length; i += 1) {
            if (elements[i].name) {
                elementForm[elements[i].name] = elements[i].value
            }
        }
        return elementForm
    }

    function setData(elementForm) {
        const {errorFields} = elementForm
        for (let i = 0; i < elements.length; i += 1) {
            elements[i].classList.remove('error')
        }
        errorFields.forEach((field) => {
            if (elementsName.includes(field)) {
                elements[field].classList.add('error')
            }
        })
        return
    }

    function validate() {
        const data = MyForm.getData(elements)
        const {validateFio, validateEmail, validatePhone} = methodsValidate
        let isValid = true
        let errorFields = []
        function error (key) {
            isValid = false
            errorFields.push(key)
        }

        for (let key in data) {
            if (key === 'fio' && !validateFio(data[key])) {
               error(key) 
            }
            if (key === 'email' && !validateEmail(data[key])) {
               error(key) 
            }
            if (key === 'phone' && !validatePhone(data[key])) {
               error(key) 
            }
        }
        return {
            isValid,
            errorFields
        }
    }

    function request (xhr, body, target) {
        const url = form.getAttribute('action')
        xhr.open('POST', url, true)
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
        xhr.send(body.substr(1))
        target.setAttribute('disabled', true);
    }

    submit.addEventListener('click', (e) => {
        e.preventDefault()
        const target = e.target
        const validate = MyForm.validate()
        const {isValid} = validate

        setData(validate)
        if (!isValid) {
            const xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if(xhr.status == 200) {
                        target.removeAttribute('disabled')
                        const xnrResult = JSON.parse(xhr.responseText)
                        if (xnrResult.status.includes('error')) {
                            result.classList.add('error')
                            result.innerHTML = xnrResult.reason
                        } else if (xnrResult.status.includes('progress')) {
                            result.classList.add('progress')
                            setTimeout(request(xhr, bodyRequest, target), xnrResult.timeout)
                        } else {
                            result.classList.add('success')
                            result.innerHTML = 'Success'
                            form.reset()
                        }

                    } else {
                        target.removeAttribute('disabled')
                        console.log( xhr.status + ': ' + xhr.statusText )
                    }
                }
            }
            const elementForm = MyForm.getData(elements)
            let bodyRequest = ''
            for (let key in elementForm) {
                bodyRequest += `&${key}=${elementForm[key]}`
            }
            request(xhr, bodyRequest, target)
        }
    })

}, false)
