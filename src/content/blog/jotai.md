---
author: Willian Pinheiro
pubDatetime: 2024-08-06T03:05:53.000-03:00
modDatetime:
title: Jotai
featured: false
draft: false
tags:
    - react
description: Uma biblioteca baseada em átomos para gerenciamento de estados em React
---

Jotai é uma das melhores bibliotecas que encontrei para gerenciamento de estados em React. Usar ele
é como usar a hook `useState`, porém globalmente

Ele é baseado em átomos, que são pequenos pedaços de estados, muito semelhantes ao `useState`

```ts
import { atom } from "jotai";

export const countAtom = atom(0);
```

Acima, definimos um átomo. Para usá-lo em um componente, temos as hooks `useAtom`, `useSetAtom` e `useAtomValue`

```tsx
import { countAtom } from "./atoms";

export function IncreaseButton() {
	const setCount = useSetAtom(countAtom);

	const increase = () => {
		setCount(c => c + 1);
	};

	return <button onClick={increase}>Increase</button>;
}
```

Note que ele é muito parecido com `useState`, a única diferença é que seu estado pode ser acessado por outros componentes sem termos que passar props para esses outros componentes ou usar Context

```tsx
import { IncreaseButton } from "./somewhere";

function Counter() {
	const count = useAtomValue(countAtom);

	return (
		<>
			<span>Count: {count}</span>
			<IncreaseButton />
		</>
	);
}
```

# Providers

Note que os átomos são acessíveis globalmente por todos os componentes, mas nem sempre esse é o comportamento desejado. Ao invés disso, podemos encapsular um componente com um provider

```tsx
import { Provider } from "jotai";

<Provider>
	<Counter />
</Provider>;
```

Isso fará com que uma instância do átomo `countAtom` esteja encapsulada dentro desse provider, ou seja, se tivermos outros componentes que utilizam esse átomo fora do provider, seus estados serão diferentes
