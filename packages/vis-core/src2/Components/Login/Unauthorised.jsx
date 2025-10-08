import React from 'react';
import { Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

const ScrollLock = createGlobalStyle`
    html, body {
        overflow: hidden !important;
    }
`;

const Wrapper = styled.main`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    padding: 1.5rem 1rem;
    overflow: hidden;

    @media (max-height: 700px) {
        place-items: start center;
    }
`;

const Card = styled.section`
    text-align: center;
    max-width: 720px;
    width: 100%;
`;

const Logo = styled.img`
    height: 64px;
    margin-bottom: 1rem;
    user-select: none;
`;

const Title = styled.h1`
    margin: 0.25rem 0;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#111'};
`;

const Subtitle = styled.p`
    margin: 0.5rem 0 1.75rem;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#666'};
`;

const Actions = styled.div`
    display: inline-flex;
    gap: 0.75rem;
`;

const PrimaryLink = styled(Link)`
    padding: 0.625rem 1rem;
    border-radius: 8px;
    background: ${({ theme }) => theme?.colors?.primary || '#7317de'};
    color: #fff;
    text-decoration: none;
    font-weight: 600;
`;

/**
 * Unauthorized component displays an unauthorized access message.
 * 
 * @component
 * @returns {JSX.Element} The JSX element representing the Unauthorized page.
 */
export const Unauthorized = () => {
    return (
        <>
            <ScrollLock />
            <Wrapper>
                <Card>
                    <Logo
                        className="auth-card__logo"
                        src="/img/tfn-logo-fullsize.png"
                        alt="Transport for the North"
                    />
                    <Title>Unauthorised</Title>
                    <Subtitle>You are not authorised to access this app. If you believe this is an error, please contact luke.monaghan@transportforthenorth.com</Subtitle>
                    <Actions>
                        <PrimaryLink to="/login">Return to login</PrimaryLink>
                    </Actions>
                </Card>
            </Wrapper>
        </>
    );
};

export default Unauthorized;