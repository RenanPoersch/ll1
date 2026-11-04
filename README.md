# Analisador LL(1)

Use Node.js 22.18 ou mais recente da série 22. Na pasta do projeto, execute:

```sh
npm install
npm start
```

## Usar a tela

- Digite uma expressão, como `(0+1)*1`, ou selecione **Gerar sentença**.
- Selecione **Iniciar passo a passo** para avançar com **Próximo passo**. **Analisar automaticamente** continua do último passo executado e avança a cada 600 ms.
- A tabela mostra a pilha com o topo à direita, a entrada restante e a ação de cada passo. Selecione um passo anterior para rever a célula que ele consultou na tabela de parsing.
- Para ver uma rejeição, experimente `0+`. Use **Nova análise** para limpar a entrada.
