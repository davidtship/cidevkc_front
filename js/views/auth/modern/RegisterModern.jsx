import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button, Form, Stack } from 'react-bootstrap';
import TitleHelmet from '@/components/Common/TitleHelmet';
import AuthLayout from '@/Layouts/AuthLayout';
import AuthModern from './AuthModern';
const generatePassword = (length) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~@#$%^&*(){}[]';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }
    return password;
};
const RegisterModern = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(generatePassword(0));
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [communityEmail, setCommunityEmail] = useState(false);
    const [termsConditions, setTermsConditions] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleGeneratePassword = () => {
        setPassword(generatePassword(16));
    };
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleRegister = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('Register successful!');
            setTimeout(() => {
                navigate('/auth/modern/register-success', {
                    state: { username, email, password },
                });
            }, 1500);
        }, 2000);
    };
    return (<>
      <TitleHelmet title="Register Modern"/>
      <AuthLayout>
        <AuthModern>
          <div className="mb-12">
            <h4 className="fw-bold mb-3">Create an Account</h4>
            <p className="fs-16 lead">
              Let's get you all set up, so you can verify your personal account and begin setting up
              your profile.
            </p>
          </div>
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </Form.Group>
            <Form.Group className="mb-3 position-relative">
              <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
              <span className="btn btn-icon position-absolute translate-middle top-50" style={{ right: '1rem' }} onClick={handleTogglePasswordVisibility}>
                <i className={`fi ${showPassword ? 'fi-rr-eye-crossed' : 'fi-rr-eye'}`}></i>
              </span>
              <span className="btn btn-icon position-absolute translate-middle top-50" style={{ right: '-1rem' }} onClick={handleGeneratePassword}>
                <i className="fi fi-rr-magic-wand"></i>
              </span>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
            </Form.Group>
            <Stack gap={2} className="text-start mt-4">
              <Form.Check type="checkbox" id="check-api-community-email">
                <Form.Check.Input type="checkbox" checked={communityEmail} onChange={() => setCommunityEmail(!communityEmail)}/>
                <Form.Check.Label>Yes, I wnat to receive window community emails</Form.Check.Label>
              </Form.Check>
              <Form.Check type="checkbox" id="check-api-terms-conditions">
                <Form.Check.Input type="checkbox" checked={termsConditions} onChange={() => setTermsConditions(!termsConditions)} required/>
                <Form.Check.Label>
                  I agree to all the{' '}
                  <Link to="/other-pages/terms-services">Terms & Conditions</Link> and Fees.
                </Form.Check.Label>
              </Form.Check>
            </Stack>
            <div className="d-grid gap-2 my-4">
              <Button variant="primary" size="lg" type="submit" disabled={loading} className="text-white">
                {loading ? (<>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Loading...
                  </>) : ('Register')}
              </Button>
            </div>
            <div>
              Already have an account? <Link to="/auth/modern/login">Login</Link>
            </div>
          </Form>
        </AuthModern>
      </AuthLayout>
    </>);
};
export default RegisterModern;
