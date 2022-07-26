import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import { Container } from './Components';

const FooterContainer = styled('footer')``;

export function Footer(): ReactElement {
  return (
    <FooterContainer className="">
      <Container className="border-t border-gray-400/20 dark:border-gray-800/40 py-4">
        <nav className="text-center text-sm text-slate-400">
          © {new Date().getFullYear()}{' '}
          <a href="https://haqq.network/" target="blank">
            HAQQ Network.
          </a>{' '}
          All rights reserved
        </nav>
      </Container>
    </FooterContainer>
  );
}
