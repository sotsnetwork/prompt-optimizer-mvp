
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignUpForm } from '@/components/auth/SignUpForm';

const SignUp = () => {
  return (
    <AuthLayout
      title="Create account"
      subtitle="Get started with your new account"
    >
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
