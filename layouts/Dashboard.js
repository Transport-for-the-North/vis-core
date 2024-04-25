import styled from "styled-components";

const C = styled.div`
  height: 100%;
  width: 100%;
`;

export default function Dashboard({ children }) {
  return (
    <DashboardWrapper>
      <AppMain>{children}</AppMain>
    </DashboardWrapper>
  );
}

function DashboardWrapper({ children }) {
  return <div className="fill-vp" height={'calc(100vh-75px)'}>{children}</div>;
  // Style hack prevents redundant scrollbars.
}

function AppMain({ children }) {
  return <C>{children}</C>;
}
