import { history, request, useModel } from '@umijs/max';
import { Button, Card, Form, Input, Select, message } from 'antd';
import { useState } from 'react';

type RegisterPayload = {
  email: string;
  password: string;
  confirmPassword?: string; // For client-side validation
  role?: 'owner' | 'manager' | 'kitchen' | 'rider';
};

type LoginResponse = {
  access_token: string;
  user: any; // Replace with specific User type if available
};

export default function Register() {
  const { setState } = useModel('auth');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterPayload) => {
    setLoading(true);
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = values;
      
      // 1. Register user
      await request('/api/auth/register', {
        method: 'POST',
        data: registerData,
      });

      // 2. Auto-login after successful registration
      const loginRes = await request<LoginResponse>('/api/auth/login', {
        method: 'POST',
        data: {
          email: values.email,
          password: values.password,
        },
      });

      // 3. Store authentication data
      localStorage.setItem('token', loginRes.access_token);
      setState({ user: loginRes.user });
      
      message.success('Registration successful!');
      history.push('/');
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      message.error(error?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    history.push('/login');
  };

  return (
    <Card 
      title="Create Account" 
      style={{ width: 400, margin: '120px auto' }}
      headStyle={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}
    >
      <Form 
        form={form}
        onFinish={onFinish} 
        layout="vertical"
        initialValues={{ role: 'owner' }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
        >
          <Input 
            placeholder="Enter your email" 
            autoComplete="email"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter a password' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
          hasFeedback
        >
          <Input.Password 
            placeholder="Enter password" 
            autoComplete="new-password"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password 
            placeholder="Confirm your password" 
            autoComplete="new-password"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          tooltip="Select your account role"
        >
          <Select 
            placeholder="Select a role"
            disabled={loading}
          >
            <Select.Option value="owner">Owner</Select.Option>
            <Select.Option value="manager">Manager</Select.Option>
            <Select.Option value="kitchen">Kitchen Staff</Select.Option>
            <Select.Option value="rider">Rider</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block
            loading={loading}
            disabled={loading}
          >
            Register
          </Button>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
          <Button 
            type="link" 
            onClick={handleLoginRedirect}
            disabled={loading}
          >
            Already have an account? Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}