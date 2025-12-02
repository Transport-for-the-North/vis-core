import styled from "styled-components";

const C = styled.div`
  height: 100%;
  width: 100%;
`;

/**
 * Dashboard component to wrap the main content.
 * @function Dashboard
 * @param {React.ReactNode} children - The child components to render inside the Dashboard.
 * @returns {JSX.Element} The rendered Dashboard component.
 */
export default function Dashboard({ children }) {
  return (
    <DashboardWrapper>
      <AppMain>{children}</AppMain>
    </DashboardWrapper>
  );
}

/**
 * DashboardWrapper component to wrap the dashboard content.
 * @function DashboardWrapper
 * @param {React.ReactNode} children - The child components to render inside the DashboardWrapper.
 * @returns {JSX.Element} The rendered DashboardWrapper component.
 */
function DashboardWrapper({ children }) {
  return <div className="fill-vp" height={'calc(100vh-75px)'}>{children}</div>;
  // Style hack prevents redundant scrollbars.
}

/**
 * AppMain component to wrap the main application content.
 *
 * @param {React.ReactNode} children - The child components to render inside the AppMain.
 * @returns {JSX.Element} The rendered AppMain component.
 */
function AppMain({ children }) {
  return <C>{children}</C>;
}
