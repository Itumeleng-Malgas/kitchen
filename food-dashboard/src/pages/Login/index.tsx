import { useModel, history, request } from '@umijs/max';
import { 
  Button, 
  Card, 
  Form, 
  Input, 
  message, 
  Checkbox, 
  Typography, 
  Space 
} from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Text, Link } = Typography;

interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

interface LoginResponse {
  access_token: string;
  user: any;
  expires_in?: number;
  token_type?: string;
}

export default function LoginPage() {
  const { initialState, setInitialState, loading, refresh } = useModel('@@initialState');
  const [form] = Form.useForm();
  const [loginLoading, setLoginLoading] = useState(false);

  const initialValues = {
    email: localStorage.getItem('rememberedEmail') || '',
    password: '',
    remember: !!localStorage.getItem('rememberedEmail'),
  };

  const handleLogin = async (values: LoginPayload) => {
    setLoginLoading(true);
    
    try {
      const { remember, ...loginData } = values;

      const response = await request<LoginResponse>('/api/auth/login', {
        method: 'POST',
        data: loginData,
      });

      // Store email for "remember me" feature
      if (remember) {
        localStorage.setItem('rememberedEmail', values.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      if (response.user) {
        await setInitialState((prevState: any) => ({
          ...prevState,
          currentUser: response.user,
        }));

        await refresh() // Re-execute the getInitialState method 
        history.push('/orders');
      }

      message.success('Login successful');
      form.resetFields(['password']);

    } catch (error: any) {
      handleLoginError(error);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLoginError = (error: any) => {
    console.error('Login failed:', error);
    
    const status = error?.response?.status ?? error?.status;
    let errorMessage = 'Login failed. Please try again.';

    switch (status) {
      case 401:
        errorMessage = 'Invalid email or password';
        break;
      case 403:
        errorMessage = 'Account is disabled';
        break;
      case 429:
        errorMessage = 'Too many attempts. Try again later';
        break;
      default:
        if (status >= 500) {
          errorMessage = 'Server error. Please try again later';
        }
    }

    message.error(error?.data?.message || errorMessage);
    form.setFieldsValue({ password: '' });
  };

  return (
    <Card
      title="nQue Technologies"
      style={{
        width: 420,
        margin: '80px auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: 8,
      }}
      headStyle={{
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        borderBottom: 'none',
        padding: '24px 24px 0',
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleLogin}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Invalid email format' },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Enter your email"
            size="large"
            disabled={loginLoading}
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Minimum 6 characters' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your password"
            size="large"
            disabled={loginLoading}
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox disabled={loading}>Remember me</Checkbox>
            </Form.Item>

            <Button
              type="link"
              disabled={loading}
              onClick={() => history.push('/forgot-password')}
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
            loading={loginLoading}
          >
            Login
          </Button>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
          <Text type="secondary">
            Don&apos;t have an account?{' '}
            <Link
              onClick={() => history.push('/register')}
              disabled={loading}
            >
              Register now
            </Link>
          </Text>
        </Form.Item>
      </Form>
    </Card>
  );
}