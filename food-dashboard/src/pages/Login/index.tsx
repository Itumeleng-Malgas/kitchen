import { useModel, history, request, useLocation, useSearchParams } from '@umijs/max';
import { Button, Card, Form, Input, message, Checkbox, Typography, Space } from 'antd';
import { useState, useEffect } from 'react';
import { LockOutlined, MailOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;

type LoginPayload = {
  email: string;
  password: string;
  remember?: boolean;
};

type LoginResponse = {
  access_token: string;
  user: any;
  expires_in?: number;
  token_type?: string;
};

export default function Login() {
  const { setState } = useModel('auth');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const [searchParams] = useSearchParams(); // To get query parameters

  // Auto-fill saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    
    if (savedEmail && savedPassword) {
      form.setFieldsValue({
        email: savedEmail,
        password: savedPassword,
        remember: true
      });
    }
  }, [form]);

  const onFinish = async (values: LoginPayload) => {
    setLoading(true);
    
    try {
      const { remember, ...loginData } = values;
      
      const res = await request<LoginResponse>('/api/auth/login', {
        method: 'POST',
        data: loginData,
      });

      // Store token
      localStorage.setItem('token', res.access_token);
      
      // Handle remember me functionality
      if (remember) {
        localStorage.setItem('rememberedEmail', values.email);
        localStorage.setItem('rememberedPassword', values.password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }
      
      // Update auth state
      setState({ 
        user: res.user,
        token: res.access_token 
      });
      
      message.success('Login successful!');
      
      // Get redirect URL from query params
      const redirectTo = searchParams.get('redirect') || searchParams.get('from') || '/';
      history.push(redirectTo);
      
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Show user-friendly error messages
      const status = error?.response?.status;
      let errorMessage = 'Login failed. Please try again.';
      
      if (status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (status === 403) {
        errorMessage = 'Account is disabled. Please contact support';
      } else if (status === 429) {
        errorMessage = 'Too many attempts. Please try again later';
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later';
      }
      
      message.error(errorMessage);
      
      // Clear password field on error
      form.setFieldsValue({ password: '' });
      
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    history.push('/forgot-password');
  };

  const handleRegisterRedirect = () => {
    history.push('/register');
  };

  const handleDemoLogin = async (role: 'owner' | 'manager' | 'kitchen' | 'rider') => {
    setLoading(true);
    try {
      // Demo credentials - consider moving to .env file for production
      const demoCredentials = {
        owner: { email: 'owner@demo.com', password: 'demo123' },
        manager: { email: 'manager@demo.com', password: 'demo123' },
        kitchen: { email: 'kitchen@demo.com', password: 'demo123' },
        rider: { email: 'rider@demo.com', password: 'demo123' },
      };
      
      form.setFieldsValue(demoCredentials[role]);
      await onFinish({ ...demoCredentials[role], remember: false });
      
    } catch (error) {
      message.error('Demo login failed. Please use manual login.');
      setLoading(false);
    }
  };

  // Extract initial values for form
  const getInitialValues = () => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    
    return {
      email: savedEmail || '',
      password: savedPassword || '',
      remember: !!savedEmail,
    };
  };

  return (
    <Card 
      title="Welcome Back" 
      style={{ 
        width: 420, 
        margin: '80px auto',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
      }}
      headStyle={{ 
        textAlign: 'center', 
        fontSize: '24px', 
        fontWeight: 'bold',
        borderBottom: 'none',
        padding: '24px 24px 0',
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={getInitialValues()}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input 
            prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Enter your email"
            size="large"
            disabled={loading}
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Enter your password"
            size="large"
            disabled={loading}
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 16 }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox disabled={loading}>Remember me</Checkbox>
            </Form.Item>
            
            <Button 
              type="link" 
              onClick={handleForgotPassword}
              disabled={loading}
              style={{ padding: 0 }}
            >
              Forgot password?
            </Button>
          </Space>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block
            size="large"
            loading={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form.Item>

        {/* Demo Login Buttons - Optional */}
        {process.env.NODE_ENV === 'development' && (
          <Form.Item style={{ marginBottom: 8 }}>
            <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
              Demo Accounts:
            </Text>
            <Space wrap style={{ justifyContent: 'center', marginTop: 8 }}>
              {(['owner', 'manager', 'kitchen', 'rider'] as const).map(role => (
                <Button 
                  key={role}
                  size="small"
                  onClick={() => handleDemoLogin(role)}
                  disabled={loading}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Button>
              ))}
            </Space>
          </Form.Item>
        )}

        <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
          <Text type="secondary">
            Don't have an account?{' '}
            <Link 
              onClick={handleRegisterRedirect}
              disabled={loading}
              style={{ fontWeight: 500 }}
            >
              Register now
            </Link>
          </Text>
        </Form.Item>
      </Form>
    </Card>
  );
}