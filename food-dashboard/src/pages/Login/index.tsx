import { useModel, history, request, useSearchParams } from '@umijs/max';
import { Button, Card, Form, Input, message, Checkbox, Typography, Space } from 'antd';
import { useState } from 'react';
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
  const [searchParams] = useSearchParams();

  const initialValues = {
    email: localStorage.getItem('rememberedEmail') || '',
    password: '',
    remember: !!localStorage.getItem('rememberedEmail'),
  };

  const safeRedirect = () => {
    const redirect =
      searchParams.get('redirect') || searchParams.get('from');

    return redirect && redirect.startsWith('/') ? redirect : '/';
  };

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

      if (res.expires_in) {
        localStorage.setItem(
          'token_expires_at',
          String(Date.now() + res.expires_in * 1000),
        );
      }

      // Remember email only (never password)
      if (remember) {
        localStorage.setItem('rememberedEmail', values.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Update global auth state
      setState({
        user: res.user,
        token: res.access_token,
      });

      message.success('Login successful');
      form.resetFields(['password']);

      history.push(safeRedirect());
    } catch (error: any) {
      console.error('Login error:', error);

      const status =
        error?.response?.status ?? error?.status;

      let errorMessage = 'Login failed. Please try again.';

      if (status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (status === 403) {
        errorMessage = 'Account is disabled';
      } else if (status === 429) {
        errorMessage = 'Too many attempts. Try again later';
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later';
      }

      message.error(error?.data?.message || errorMessage);
      form.setFieldsValue({ password: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Welcome Back"
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
        onFinish={onFinish}
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
            disabled={loading}
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
            disabled={loading}
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
            loading={loading}
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
