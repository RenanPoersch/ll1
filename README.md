# Analisador LL(1)

Interface Angular da opção 3. A tabela de passos fica ao lado da gramática, da tabela de parsing e dos conjuntos FIRST e FOLLOW. Toda a análise acontece no navegador.

## Executar

Use Node.js 22.18 ou mais recente da série 22. Na pasta do projeto, execute:

```sh
npm install
npm start
```

Abra http://localhost:4200. Para gerar os arquivos estáticos, execute `npm run build`. Para testar o analisador, execute `npm test`.

## Usar a tela

- Digite uma expressão, como `(a+b)*b`, ou selecione **Gerar sentença**.
- Selecione **Analisar**. A tabela mostra a pilha com o topo à esquerda, a entrada restante e a ação de cada passo. Role a tabela para ver todos os passos.
- Selecione um passo de expansão para destacar a regra no painel de consulta.
- Para ver uma rejeição, experimente `a+`. Use **Nova análise** para limpar a entrada.

O código da gramática e do analisador fica em `src/parser.ts`. O componente e a tela ficam em `src/main.ts` e `src/app.html`. Os estilos Material ficam em `src/styles.scss`.

## Histórico

O remoto `origin` aponta para `RenanPoersch/ll1`. Os commits podem ser publicados por uma conta com acesso de escrita usando `git push -u origin main`.
