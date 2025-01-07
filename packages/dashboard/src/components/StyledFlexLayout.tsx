import React from 'react';
import { Layout as FlexLayout, ILayoutProps } from 'flexlayout-react';
import { flexLayoutClassNameMapper } from './flex-layout-theming';
import { useDashboardTheme } from '@/dashboard';
import styles from './App.module.scss';

const StyledFlexLayout = React.forwardRef<FlexLayout, ILayoutProps>(
  (props, ref) => {
    const [theme] = useDashboardTheme();
    return (
      <div
        className={theme === 'light' ? 'light-scrollbars' : 'dark-scrollbars'}
      >
        <FlexLayout
          ref={ref}
          classNameMapper={(className) => {
            return flexLayoutClassNameMapper(
              className,
              theme ?? 'dark',
              styles,
            );
          }}
          {...props}
        />
      </div>
    );
  },
);

export default StyledFlexLayout;
