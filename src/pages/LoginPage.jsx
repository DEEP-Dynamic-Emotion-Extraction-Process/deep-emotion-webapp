// src/pages/LoginPage.jsx
import { AuthFormContainer } from "../components/auth/AuthFormContainer";
import { LoginForm } from "../components/auth/LoginForm";

export const LoginPage = () => {
  return (
    <AuthFormContainer title="Login">
      <LoginForm />
    </AuthFormContainer>
  );
};