export * from './networktables';
import Foo from './Foo.svelte';

if (!customElements.get('my-foo')) {
  customElements.define('my-foo', Foo.element);
}

export const FooElement = Foo.element;
