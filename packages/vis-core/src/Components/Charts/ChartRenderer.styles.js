import styled from "styled-components";
import { FaChevronDown } from "react-icons/fa";
import { CARD_CONSTANTS } from "defaults";

const { TOGGLE_BUTTON_WIDTH, TOGGLE_BUTTON_HEIGHT } = CARD_CONSTANTS;

export const Section = styled.section`
  margin: 0;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-self: stretch;
  background: #ffffff;
  border: 1px solid #dbe4ee;
  border-radius: ${(props) => props.theme.borderRadius};
  padding: 12px;
  box-sizing: border-box;
  overflow: hidden;
  grid-column: var(--chart-grid-column, span 1);
`;

export const Title = styled.h3`
  margin: 6px 0 8px;
  font-size: 1.1em;
  color: #4b3e91;
`;

export const RankBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: #a99ad6;
  color: white;
  border-radius: 50%;
  font-size: 13px;
  font-weight: bold;
  margin-right: 8px;
`;

export const NameCell = styled.td`
  color: #7c5cd6;
  font-weight: 500;
`;

export const ScoreCell = styled.td`
  font-weight: bold;
  color: #333;
  text-align: right;
`;

export const RowTr = styled.tr`
  &.row-enter {
    opacity: 0;
    transform: translateY(-10px);
  }
  &.row-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s, transform 0.3s;
  }
  &.row-exit {
    opacity: 1;
    transform: translateY(0);
  }
  &.row-exit-active {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s, transform 0.3s;
  }
`;

export const ToggleButton = styled.button`
  z-index: 1001;
  width: ${TOGGLE_BUTTON_WIDTH}px;
  height: ${TOGGLE_BUTTON_HEIGHT}px;
  background-color: #7317de;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: right 0.3s ease-in-out;
`;

export const RotatingIcon = styled(FaChevronDown)`
  transition: transform 0.3s;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;