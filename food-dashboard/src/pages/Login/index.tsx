import { useModel, history, request } from '@umijs/max';
import { Button, Card, Form, Input } from 'antd';

export default function Login() {
  const { setState } = useModel('auth');

  const onFinish = async (values: any) => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      data: values,
    });

    localStorage.setItem('token', res.access_token);
    setState({ user: res.user });
    history.push('/');
  };

  return (
    <Card style={{ width: 360, margin: '120px auto' }}>
      <Form onFinish={onFinish}>
        <Form.Item name="email" rules={[{ required: true }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
        
        <Button
          type="link"
          block
          onClick={() => history.push('/register')}
        >
          Do not have an account? Register
        </Button>
      </Form>
    </Card>
  );
}
