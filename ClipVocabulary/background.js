chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "saveVocabulary",
        title: "Salvar vocabulário para estudo posterior",
        contexts: ["selection"]
    })
})

chrome.contextMenus.onClicked.addListener((info) => {
    adicionarNovoVocabularioStorage(info)
})

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action == 'saveData') {
        const vocabulary = message.vocabulary;
        atualizarVocabulario(vocabulary)
        sendResponse({ success: true });
        return true;
    }
})

function adicionarNovoVocabularioStorage(info) {
    if (info.menuItemId === "saveVocabulary") {
        salvarVocabulario(info)
    }
}

function salvarVocabulario(info) {
    const vocabularySelection = info.selectionText
    if (vocabularySelection) {
        atualizarVocabulario(vocabularySelection)
    }
}

function verificarExistenciaDoVocabulario(vocabularyNovo) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get({ vocabulary: [] }, function (data) {
            const vocabulary = data.vocabulary || [];
            const cadastrado = vocabulary.some(entry => {
                return entry === vocabularyNovo
            })
            resolve(cadastrado);
        })
    })
}

async function traduzirVocabulario(vocabulary) {
    return new Promise((resolve, reject) => {
        const url = `http://localhost:3000/traduzir?texto=${vocabulary}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("DATA", data.translated)
                resolve(data.translated || "Sem tradução");
            })
            .catch(error => {
                console.error("Erro ao fazer a requisição", error)
                resolve("Sem tradução");
            })
    })


}

async function atualizarVocabulario(vocabularySelection) {

    chrome.storage.local.get({ vocabulary: [], translateVocabulary: [] }, async function (data) {
        data.vocabulary.push(vocabularySelection);
        const traducao = await traduzirVocabulario(vocabularySelection)
        data.translateVocabulary.push(traducao);

        chrome.storage.local.set({ vocabulary: data.vocabulary, translateVocabulary: data.translateVocabulary }, function () {
            console.log("Vocabulario salva com sucesso!", data.vocabulary, data.translateVocabulary)
        });
    })
}