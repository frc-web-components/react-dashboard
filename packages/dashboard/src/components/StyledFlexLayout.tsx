import { Layout as FlexLayout, ILayoutProps } from 'flexlayout-react';
import { flexLayoutClassNameMapper } from './flex-layout-theming';
import { useDashboardTheme } from '@/dashboard';
import styles from './App.module.scss';
import { JSX } from 'react/jsx-runtime';

export default function StyledFlexLayout(
  props: JSX.IntrinsicAttributes &
    JSX.IntrinsicClassAttributes<FlexLayout> &
    Readonly<ILayoutProps>,
) {
  const [theme] = useDashboardTheme();
  return (
    <FlexLayout
      classNameMapper={(className) => {
        return flexLayoutClassNameMapper(className, theme ?? 'dark', styles);
      }}
      {...props}
    />
  );
}
