import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { MobileBar } from './MobileBar';
import { AccordionIcon } from '../Sidebar/Accordion/AccordionSection';

const theme = { mq: { mobile: '(max-width: 900px)' } };

describe('MobileBar', () => {
  it('renders label and chevron and applies background color', () => {
    render(
      <ThemeProvider theme={theme}>
        <MobileBar $bgColor="#123456" aria-expanded={false}>
          <span>Summary</span>
          <AccordionIcon className="chev" $isOpen={false} />
        </MobileBar>
      </ThemeProvider>
    );

    // label
    expect(screen.getByText('Summary')).toBeInTheDocument();

    // chevron element from AccordionIcon
    expect(document.querySelector('.chev')).toBeInTheDocument();

    // find the button without filtering by accessible name
    const btn = screen.getByRole('button', { hidden: true });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent(/summary/i);

    // styled-components injects CSS in <style> tags; assert the color token exists
    const styles = Array.from(document.querySelectorAll('style')).map(s => s.textContent || '').join('\n');
    expect(styles).toContain('#123456');
  });
});
