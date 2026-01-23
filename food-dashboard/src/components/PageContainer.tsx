import React from 'react';
import { PageContainer as AntPageContainer, PageContainerProps as AntPageContainerProps } from '@ant-design/pro-components';

// Extend the original props to include our custom ones
export interface CustomPageContainerProps extends AntPageContainerProps {
  fullHeight?: boolean;
  customStyle?: React.CSSProperties;
}

const PageContainer: React.FC<CustomPageContainerProps> = (props) => {
  const {
    children,
    fullHeight = true,
    customStyle,
    style,
    ghost = true,
    ...restProps
  } = props;

  // Merge custom styles with default styles
  const containerStyle: React.CSSProperties = {
    ...(fullHeight ? { height: 'calc(100vh - 48px)' } : {}),
    ...style,
    ...customStyle,
  };

  return (
    <AntPageContainer
      style={containerStyle}
      ghost={ghost}
      {...restProps}
    >
      {children}
    </AntPageContainer>
  );
};

// For TypeScript compatibility, we can also export the type
export type PageContainerType = typeof PageContainer;

export default PageContainer;