import { useState } from 'react'
import styled from 'styled-components';

const AccordionHeader = styled.div`
  cursor: pointer;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 5px 5px ${({ $isOpen }) => ($isOpen ? '0 0' : '5px 5px')};
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
`;

const AccordionIcon = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-right: 2px solid #333;
  border-bottom: 2px solid #333;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(45deg)' : 'rotate(-45deg)')};
  transition: transform 0.3s ease;
`;

const AccordionContent = styled.div`
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: ${({ $isOpen }) => ($isOpen ? '15px' : '0')} 20px;
  background-color: #fff;
  border: ${({ $isOpen }) => ($isOpen ? '1px' : '0')} solid #ddd;
  border-radius: 0 0 5px 5px;
`;

/**
 * AccordionSection component represents a section in an accordion menu.
 * It contains a title and collapsible content.
 * @property {string} title - The title of the accordion section.
 * @property {ReactNode} children - The content of the accordion section.
 * @property {boolean} [defaultValue=false] - The default state of the accordion section (open or closed). Defaults to false (closed).
 * @returns {JSX.Element} The rendered AccordionSection component.
 */
export const AccordionSection = ({ title, children, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(defaultValue);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <AccordionHeader onClick={toggleAccordion} $isOpen={isOpen}>
        {title}
        <AccordionIcon $isOpen={isOpen} />
      </AccordionHeader>
      <AccordionContent $isOpen={isOpen}>
        {isOpen && children}
      </AccordionContent>
    </>
  );
};