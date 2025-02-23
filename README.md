# ClipVocabulary

## Descrição

Uma extensão do Chrome desenvolvida para ajudar no salvamento de novos vocabulários e suas traduções para o idioma nativo do usuário para estudo posterior. Ela permite que você salve palavras, veja as traduções automaticamente, e as exporte como csv posteriormente. Uma ferramenta útil para quem está aprendendo um novo idioma e deseja manter um registro das palavras aprendidas enquanto navega por motivo aleatorios em artigos e/ou videos noutra lingua.

## Funcionalidades

- Selecione o texto e adicione-o clicando no botão "Salvar vocabulário para estudo posterior" que surge ao clicar com o botão direito.
- Veja a palavra selecionada pronta para ser adiciona ao abrir o popup da extensão
- Adicione novas palavras ou frases a sua lista de vocabulário e traduções (limite 150 caracteres)
- Limpe tudo e comece uma nova lista
- Exportar dados salvos em formato CSV

## Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/usuario/my-chrome-extension.git
    ```
2. Abra o Chrome e vá para `chrome://extensions/`.
3. Ative o "Modo do desenvolvedor" no canto superior direito.
4. Clique em "Carregar sem compactação" e selecione a pasta do projeto clonado.

## Uso

1. Clique no ícone da extensão na barra de ferramentas do Chrome.
2. Adicione novas palavras e suas traduções.
3. Para exportar os dados, clique no botão de exportação e um arquivo CSV será gerado.

## Contribuição

1. Faça um fork do projeto.
2. Crie uma nova branch:
    ```bash
    git checkout -b minha-nova-funcionalidade
    ```
3. Faça suas alterações e commit:
    ```bash
    git commit -m 'Adicionei uma nova funcionalidade'
    ```
4. Envie para o repositório remoto:
    ```bash
    git push origin minha-nova-funcionalidade
    ```
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.


## Middleware de Tradução Automática

Para facilitar a tradução automática do texto, este projeto utiliza um middleware que integra com a Google Cloud Translate API. Esse middleware intercepta os vocabulários adicionado pelo usuário, envia para a API de tradução e retorna a tradução correspondente. Isso permite que os usuários obtenham traduções automáticas em tempo real, melhorando a eficiência do processo de aprendizado de idiomas.

### Como funciona

1. O usuário adiciona uma nova vocabulário.
2. O middleware captura o vocabulário e o envia para a Google Cloud Translate API.
3. A API retorna a tradução do vocabulário.
4. A tradução é salva junto com o vocabulário original no banco de dados da extensão.

### Configuração

[EM BREVE]

## Contato

Para mais informações, entre em contato pelo email: [priscila.zeferino23@gmail.com](mailto:priscila.zeferino23@gmail.com).

