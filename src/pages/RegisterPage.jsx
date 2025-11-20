// src/pages/RegisterPage.jsx
import { AuthFormContainer } from "../components/auth/AuthFormContainer";
import { RegisterForm } from "../components/auth/RegisterForm";

export const RegisterPage = () => {
  return (
    <AuthFormContainer title="Create an Account">
      <RegisterForm />
    </AuthFormContainer>
  );
};