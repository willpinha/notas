---
author: Willian Pinheiro
pubDatetime: 2024-08-06T13:47:38.000-03:00
modDatetime:
title: Componentes fullstack no Remix
featured: false
draft: false
tags:
    - remix
    - react
description: Explicação e exemplos sobre a metodologia de componentes fullstack no Remix
---

Componentes fullstack são uma maneira simples e organizada de se criar componentes client-side que realizam comunicação com o servidor

A ideia dos componentes fullstack, proposta [nesse artigo](https://www.epicweb.dev/full-stack-components), é armazenar em um mesmo arquivo de rota em `/routes` uma função `loader` (GET) OU `action` (POST, PUT, ...) junto de um componente (chamado aqui de **componente fullstack**) que utilize a respectiva função

Ao importarmos esse componente fullstack em outras rotas, sabemos que ele fará a comunicação com o servidor, porém essa comunicação fica escondida no próprio arquivo de rota do componente

# Como implementar?

A implementação é feita através de [resource routes](https://remix.run/docs/en/main/guides/resource-routes), ou seja, uma rota que serve como endpoint e não contém nenhuma página de UI3

Criamos um arquivo em `/routes` contendo uma função `loader` ou `action` e exportamos um componente que fará comunicação com essa função através da hook `useFetcher`

Note que, além de `useFetcher`, podemos utilizar `Form` e `useSubmit` diretamente. O único motivo
de preferir utilizar `useFetcher` ao invés das outras duas abordagens é que ele, por si só, é uma
implementação que une essas outras duas (com `fetcher.Form` e `fetcher.submit`)

# Exemplo de implementação

No arquivo `routes/components.my-component.tsx`, definimos uma `action` e um componente fullstack
chamado `MyComponent`:

```tsx
export async function action({ request }: ActionFunctionArgs) {
	console.log(await request.json());

	return null;
}

type MyComponentProps = {
	name: string;
};

export function MyComponent({ name }: MyComponentProps) {
	const fetcher = useFetcher();

	const handleFetch = () => {
		fetcher.submit(
			{ hello: "world" },
			{
				method: "POST",
				action: "/components/my-component",
				encType: "application/json",
			}
		);
	};

	return <button onClick={handleFetch}>Hello {name}, submit!</button>;
}
```

Agora, em outro arquivo de outra rota, podemos utilizar esse `MyComponent` como se fosse um componente normal, sabendo que por baixo dos panos ele realiza comunicação com o servidor

No arquivo `routes/_index.tsx`, usamos `MyComponent`:

```tsx
import { MyComponent } from "~/routes/components.my-component";

export default function Page() {
	return <MyComponent name="Will" />;
}
```

# Casos de uso

## UI de carregamento

Para mostrar uma UI de carregamento enquanto o componente fullstack realiza a comunicação com o servidor, basta utilizar `fetcher.state`, que pode ser _idle_, _submitting_ ou _loading_

```tsx
export async function action() {
	// ...
}

export function MyComponent({ name }: MyComponentProps) {
	const fetcher = useFetcher();

	const handleFetch = () => {
		// ...
	};

	const loading = fetcher.state !== "idle";

	return (
		<>
			{loading && "Loading..."}

			<button onClick={handleFetch}>Hello {name}, submit!</button>
		</>
	);
}
```

Note que se a comunicação for muito rápida, a UI de carregamento apenas piscará por alguns milésimos, o que não é uma experiência de usuário agradável

Para garantirmos que a UI de carregamento não pisque, podemos utilizar a biblioteca [spin-delay](https://www.npmjs.com/package/spin-delay), que valida esses casos. Abaixo há um exemplo de UI de
carregamento com essa biblioteca:

```tsx
import { useSpinDelay } from "spin-delay";

export async function action() {
	// ...
}

export function MyComponent({ name }: MyComponentProps) {
	const fetcher = useFetcher();

	const handleFetch = () => {
		// ...
	};

	const loading = useSpinDelay(fetcher.state !== "idle", {
		delay: 500,
		minDuration: 200,
	});

	return (
		<>
			{loading && "Loading..."}

			<button onClick={handleFetch}>Hello {name}, submit!</button>
		</>
	);
}
```
