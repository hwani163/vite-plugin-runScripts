## Installation
```
npm install vite-plugin-runScripts -D
```

## How to use?
```js
import { defineConfig } from "vite"
import react from '@vitejs/plugin-react';
import { runScripts } from 'vite-plugin-runScripts'

export default defineConfig({
	plugins: [react(), runScripts([/* optionsArray */])]
})
```

## Options
```ts
{
  name: string;
  run: (env?: RunOption) => Promise<void>;
  matcher: (path: string) => boolean;
};
```

## License
MIT
