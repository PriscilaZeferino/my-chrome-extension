const vocabularyInput = document.getElementById('vocabularyInput')
const vocabularyTableBody = document.getElementById('vocabularyTableBody')
const clearAll = document.getElementById('clearAll')
const btnAddVocabulary = document.getElementById('btnAddVocabulary')
const btnDownloadCSV = document.getElementById('downloadCSV')

vocabularyInput.addEventListener('input', function () {
    this.style.height = 'auto'
    this.style.height = this.scrollHeight + 'px'
})

document.addEventListener('DOMContentLoaded', function () {
    obterPalavrasChromeStorage()
    selecionarTextoEPreencherInput()
})

btnAddVocabulary.addEventListener('click', async function () {
    const vocabulary = vocabularyInput.value;
    if (vocabulary.length > 150) {
        alert("Não é possivel adicionar vocabulario com mais de 150 caracteres")
        return;
    }

    const palavraJaCadastrada = await verificarExistenciaDoVocabulario(vocabulary)
    if (!palavraJaCadastrada) {
        chrome.runtime.sendMessage({
            action: 'saveData',
            vocabulary: vocabulary
        }, function (result) {
            if (chrome.runtime.lastError) {
                console.error("Erro ao salvar vocabulário:", chrome.runtime.lastError)
                return;
            }

            if (result?.success) {
                console.log("sucesso")
                limparTabela()
                obterPalavrasChromeStorage()
            }
        })
    } else {
        alert('Vocabulário já está cadastrado. Adicione um novo vocabulário.')
    }

})

function obterPalavrasChromeStorageParaCSV() {
    const csvData = []
    chrome.storage.local.get({ vocabulary: [], translateVocabulary: [] }, function (data) {
        if (data.vocabulary.length == 0) {
            return;
        } else {
            data.vocabulary.forEach((item, index) => {
                csvData.push([item, data.translateVocabulary[index]] || 'Sem tradução')
            })

            const csvContent = csvData.map(row => row.join(",")).join("\n")
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url;
            link.download = `vocabulary_${new Date().toISOString().replace(/[:.]/g, "-")}.csv`;
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    })


}

btnDownloadCSV.addEventListener('click', function () {
    obterPalavrasChromeStorageParaCSV()
})

clearAll.addEventListener('click', function () {
    limparDadosNoChromeStorage()
})

function selecionarTextoEPreencherInput() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabId = tabs[0].id
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => window.getSelection().toString()
        }, function (selection) {
            if (selection && selection[0]) {
                var selectedText = selection[0].result
                if (selectedText.length >= 150) {
                    selectedText = selectedText.substring(0, 150);
                    warning.style.display = 'block'
                }

                vocabularyInput.value = selectedText
            }
        })
    })
}

function obterPalavrasChromeStorage() {
    chrome.storage.local.get({ vocabulary: [], translateVocabulary: [] }, function (data) {
        if (data.vocabulary.length == 0) {
            adicionarTextoSemVocabulario();
        } else {
            data.vocabulary.forEach((item, index) => {
                adicionarNovoVocabulario(item)
                adicionarTraducaoVocabulario(item, data.translateVocabulary[index])
            })
        }
    })
}

function limparDadosNoChromeStorage() {
    chrome.storage.local.clear(function () {
        limparTabela()
        adicionarTextoSemVocabulario()
    })
}

function verificarExistenciaDoVocabulario(vocabularyNovo) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get({ vocabulary: [] }, function (data) {
            const vocabulary = data.vocabulary || [];
            const cadastrado = vocabulary.some(entry => {
                console.log(entry === vocabularyNovo)
                return entry === vocabularyNovo
            })
            resolve(cadastrado);
        })
    })
}

function limparTabela() {
    vocabularyTableBody.innerHTML = ''
    console.log("limparTabela")

}

function adicionarTextoSemVocabulario() {
    const semVocabulario = "Você ainda não adicionou nenhum vocabulário"
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    td.setAttribute("colspan", '2')
    td.textContent = semVocabulario
    td.appendChild(tr)
    vocabularyTableBody.appendChild(td)
}

function adicionarNovoVocabulario(vocabulary) {
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    td.id = 'vocabulary-' + vocabulary.toLowerCase().replace(/\s+/g, '-');
    td.textContent = vocabulary;
    tr.appendChild(td)
    vocabularyTableBody.appendChild(tr)
}

function adicionarTraducaoVocabulario(vocabulary, translateVocabulary) {
    const tdVocabulary = document.getElementById('vocabulary-' + vocabulary.toLowerCase().replace(/\s+/g, '-'));

    if (tdVocabulary) {
        const trVocabulary = tdVocabulary.parentElement
        const td = document.createElement('td')
        td.textContent = translateVocabulary;
        trVocabulary.appendChild(td)
    }
}

