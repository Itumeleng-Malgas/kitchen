import React, { useEffect, useState } from 'react';
import { ProCard, ProForm, ProFormSelect } from '@ant-design/pro-components';
import {
  CreditCardOutlined,
  GoogleOutlined,
  PayCircleOutlined,
  SafetyOutlined,
  BankOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Space,
  Tag,
  Alert,
  Radio,
  Modal,
  message,
  Input,
  Form,
  Divider,
} from 'antd';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

interface PaymentMethodProps {
  onPaymentComplete: (paymentData: any) => void;
  loading?: boolean;
  compact?: boolean;
}

const GooglePayButton: React.FC<{ onSuccess: (data: any) => void }> = ({ onSuccess }) => {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    // Check if Google Pay is available
    if (window.google && window.google.payments) {
      const paymentsClient = new google.payments.api.PaymentsClient({
        environment: 'TEST', // Change to PRODUCTION in production
      });

      const isReadyToPayRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA'],
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'stripe',
                'stripe:version': '2020-08-27',
                'stripe:publishableKey': process.env.STRIPE_PUBLISHABLE_KEY,
              },
            },
          },
        ],
      };

      paymentsClient.isReadyToPay(isReadyToPayRequest)
        .then((response) => setIsAvailable(response.result))
        .catch(() => setIsAvailable(false));
    }
  }, []);

  const handleGooglePay = () => {
    const paymentsClient = new google.payments.api.PaymentsClient({
      environment: 'TEST',
    });

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'stripe',
              'stripe:version': '2020-08-27',
              'stripe:publishableKey': process.env.STRIPE_PUBLISHABLE_KEY,
            },
          },
        },
      ],
      merchantInfo: {
        merchantId: 'BCR2DN4T25J5L3L4', // Your Google Pay merchant ID
        merchantName: 'Restaurant Kiosk Solutions',
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: '79.00', // Update dynamically based on plan
        currencyCode: 'USD',
        countryCode: 'US',
      },
    };

    paymentsClient.loadPaymentData(paymentDataRequest)
      .then((paymentData) => {
        onSuccess(paymentData);
      })
      .catch((error) => {
        message.error(`Google Pay failed: ${error.message}`);
      });
  };

  if (!isAvailable) return null;

  return (
    <Button
      type="primary"
      size="large"
      icon={<GoogleOutlined />}
      onClick={handleGooglePay}
      style={{
        background: '#4285f4',
        borderColor: '#4285f4',
        width: '100%',
      }}
    >
      Pay with Google Pay
    </Button>
  );
};

const StripePaymentForm: React.FC<{ onSuccess: (data: any) => void }> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        message.error(error.message || 'Payment failed');
      } else {
        onSuccess(paymentMethod);
      }
    } catch (error) {
      message.error('Payment processing error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onSubmitCapture={handleSubmit}>
      <Form.Item label="Card Details">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        disabled={!stripe}
        block
        size="large"
      >
        Pay $79.00
      </Button>
    </Form>
  );
};

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  onPaymentComplete,
  loading,
  compact,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('google_pay');
  const [showCardForm, setShowCardForm] = useState(false);

  const paymentMethods = [
    {
      id: 'google_pay',
      name: 'Google Pay',
      icon: <GoogleOutlined />,
      description: 'Fast and secure payment',
      color: '#4285f4',
    },
    {
      id: 'credit_card',
      name: 'Credit Card',
      icon: <CreditCardOutlined />,
      description: 'Visa, Mastercard, American Express',
      color: '#1890ff',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: <BankOutlined />,
      description: 'Direct bank payment',
      color: '#52c41a',
    },
  ];

  const handlePayment = (data: any) => {
    onPaymentComplete({
      method: paymentMethod,
      data,
    });
  };

  if (compact) {
    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="Secure Payment"
          description="Your payment information is encrypted and secure"
          type="info"
          showIcon
          icon={<SafetyOutlined />}
          style={{ marginBottom: 16 }}
        />
        
        <GooglePayButton onSuccess={handlePayment} />
        
        <Divider plain>or</Divider>
        
        <Elements stripe={stripePromise}>
          <StripePaymentForm onSuccess={handlePayment} />
        </Elements>
      </Space>
    );
  }

  return (
    <ProCard
      title="Payment Methods"
      extra={<Tag color="green" icon={<SafetyOutlined />}>Secure</Tag>}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="All payments are secured with 256-bit SSL encryption"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>
            Choose Payment Method
          </div>
          <Radio.Group
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {paymentMethods.map((method) => (
                <Radio.Button
                  key={method.id}
                  value={method.id}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    height: 'auto',
                    padding: 16,
                    marginBottom: 8,
                    borderColor: paymentMethod === method.id ? method.color : undefined,
                  }}
                >
                  <Space>
                    <div style={{ fontSize: 20, color: method.color }}>
                      {method.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{method.name}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        {method.description}
                      </div>
                    </div>
                  </Space>
                </Radio.Button>
              ))}
            </Space>
          </Radio.Group>
        </div>

        <Divider />

        {paymentMethod === 'google_pay' && (
          <>
            <GooglePayButton onSuccess={handlePayment} />
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <Button type="link" onClick={() => setPaymentMethod('credit_card')}>
                Use credit card instead
              </Button>
            </div>
          </>
        )}

        {paymentMethod === 'credit_card' && (
          <Elements stripe={stripePromise}>
            <StripePaymentForm onSuccess={handlePayment} />
          </Elements>
        )}

        {paymentMethod === 'bank_transfer' && (
          <ProForm
            submitter={{
              render: (_, dom) => <div style={{ textAlign: 'right' }}>{dom}</div>,
            }}
            onFinish={async (values) => {
              console.log(values);
              onPaymentComplete({ method: 'bank_transfer', data: values });
            }}
          >
            <ProFormText
              name="accountName"
              label="Account Holder Name"
              placeholder="Enter account holder name"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="accountNumber"
              label="Account Number"
              placeholder="Enter account number"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="routingNumber"
              label="Routing Number"
              placeholder="Enter routing number"
              rules={[{ required: true }]}
            />
            <ProFormSelect
              name="bankName"
              label="Bank Name"
              placeholder="Select bank"
              options={[
                { value: 'chase', label: 'Chase Bank' },
                { value: 'bankofamerica', label: 'Bank of America' },
                { value: 'wellsfargo', label: 'Wells Fargo' },
                { value: 'citibank', label: 'Citi Bank' },
              ]}
              rules={[{ required: true }]}
            />
          </ProForm>
        )}

        <Alert
          message={
            <Space>
              <SafetyOutlined />
              <span>Your payment is protected by our security guarantee</span>
            </Space>
          }
          type="success"
          style={{ marginTop: 24 }}
        />
      </Space>
    </ProCard>
  );
};

export default PaymentMethod;