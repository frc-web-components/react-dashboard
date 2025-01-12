export function flexLayoutClassNameMapper(
  className: string,
  theme: string,
  styles: Record<string, string>, // kludge
) {
  if (theme == 'dark') return className;
  switch (className) {
    case 'flexlayout__border':
      return `${className} ${styles['flex-border']}`;
    case 'flexlayout__border_left':
      return `${className} ${styles['flex-border-left']}`;
    case 'flexlayout__border_button':
      return `${className} ${styles['flex-border-button']}`;
    case 'flexlayout__border_button--selected':
      return `${className} ${styles['flex-border-button-selected']}`;
    case 'flexlayout__border_button_content':
      return `${className} ${styles['flex-border-button-content']}`;
    case 'flexlayout__tab':
      return `${className} ${styles['flex-tab']}`;
    case 'flexlayout__tab_button':
      return `${className} ${styles['flex-tab-button']}`;
    case 'flexlayout__tab_button--selected':
      return `${className} ${styles['flex-tab-button-selected']}`;
    case 'flexlayout__tab_button_content':
      return `${className} ${styles['flex-tab-button-content']}`;
    case 'flexlayout__tabset':
      return `${className} ${styles['flex-tabset']}`;
    case 'flexlayout__tabset-selected':
      return `${className} ${styles['flex-tabset-selected']}`;
    case 'flexlayout__tabset_tabbar_outer':
      return `${className} ${styles['flex-tabset-tabbar-outer']}`;
    case 'flexlayout__tabset_tabbar_outer_top':
      return `${className} ${styles['flex-tabset-tabbar-outer-top']}`;
    case 'flexlayout__splitter':
      return `${className} ${styles['flex-layout-splitter']}`;
    default:
      return className;
  }
}
