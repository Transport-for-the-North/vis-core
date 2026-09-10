import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import { withRoleValidation } from './withRoleValidation';
import * as authUtils from '../utils/auth';

jest.mock('js-cookie');
jest.mock('../runtime', () => ({
  getAppName: () => 'testapp',
}));

describe('withRoleValidation', () => {
  const ProtectedComponent = () => <div>Protected Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects unauthenticated users to /login', () => {
    Cookies.get.mockReturnValue(undefined);

    const Wrapped = withRoleValidation(ProtectedComponent);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<Wrapped />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects unauthorized users to /unauthorized when user lacks app role', () => {
    Cookies.get.mockReturnValue('valid_token');
    jest.spyOn(authUtils, 'getUserRoles').mockReturnValue(['otherapp_user']);

    const Wrapped = withRoleValidation(ProtectedComponent);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<Wrapped />} />
          <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders wrapped component when user has app_user role', () => {
    Cookies.get.mockReturnValue('valid_token');
    jest.spyOn(authUtils, 'getUserRoles').mockReturnValue(['testapp_user']);

    const Wrapped = withRoleValidation(ProtectedComponent);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<Wrapped />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders wrapped component when user has all_admin role for adminOnly route', () => {
    Cookies.get.mockReturnValue('valid_token');
    jest.spyOn(authUtils, 'getUserRoles').mockReturnValue(['all_admin']);

    const Wrapped = withRoleValidation(ProtectedComponent, { adminOnly: true });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<Wrapped />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to /unauthorized when non-admin accesses adminOnly route', () => {
    Cookies.get.mockReturnValue('valid_token');
    jest.spyOn(authUtils, 'getUserRoles').mockReturnValue(['testapp_user']);

    const Wrapped = withRoleValidation(ProtectedComponent, { adminOnly: true });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<Wrapped />} />
          <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('handles malformed tokens safely without crashing', () => {
    Cookies.get.mockReturnValue('malformed.not-a-valid-jwt.token');
    jest.spyOn(authUtils, 'getUserRoles').mockReturnValue([]);

    const Wrapped = withRoleValidation(ProtectedComponent);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<Wrapped />} />
          <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
  });
});
