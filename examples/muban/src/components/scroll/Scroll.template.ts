import { html } from '@muban/template';

export function scrollTemplate(ref?: string): string {
  return html`
    <div data-component="scroll" data-ref=${ref}>
      <span class="badge bg-primary component-label">scroll-component</span>
      <p class="mb-0" data-ref="paragraph">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet esse ex fugit hic obcaecati
      qui, reprehenderit sequi voluptas! Ducimus fuga quidem quisquam tempora ullam? Aspernatur cum
      cumque dicta qui quibusdam?</p>
    </p>
  `;
}
