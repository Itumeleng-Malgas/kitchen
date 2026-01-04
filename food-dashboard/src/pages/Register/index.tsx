import { history, request, useModel } from '@umijs/max';
import { Button, Card, Form, Input, Select } from 'antd';

type RegisterPayload = {
  email: string;
  password: string;
  role?: 'OWNER' | 'MANAGER' | 'KITCHEN' | 'RIDER';
};

export default function Register() {
  const { setState } = useModel('auth');

  const onFinish = async (values: RegisterPayload) => {
    const res = await request('/api/auth/register', {
      method: 'POST',
      data: values, // ✅ JSON body
    });

    /**
     * Optional: auto-login after register
     * If you prefer redirect to /login instead, remove this block
     */
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      data: {
        email: values.email,
        password: values.password,
      },
    });

    localStorage.setItem('token', loginRes.access_token);
    setState({ user: loginRes.user });
    history.push('/');
  };

  return (
    <Card style={{ width: 360, margin: '120px auto' }}>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: 'email' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, min: 6 }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          initialValue="OWNER"
        >
          <Select>
            <Select.Option value="OWNER">Owner</Select.Option>
            <Select.Option value="MANAGER">Manager</Select.Option>
            <Select.Option value="KITCHEN">Kitchen</Select.Option>
            <Select.Option value="RIDER">Rider</Select.Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Register
        </Button>

        <Button
          type="link"
          block
          onClick={() => history.push('/login')}
        >
          Already have an account? Login
        </Button>
      </Form>
    </Card>
  );
}
