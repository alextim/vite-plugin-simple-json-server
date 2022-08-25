import { defineBuildConfig } from 'unbuild';
import { alias } from './alias';

export default defineBuildConfig({
  entries: ['src/index'],
  clean: false,
  declaration: true,
  externals: ['vite'],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  alias,
});
