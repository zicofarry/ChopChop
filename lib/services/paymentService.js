const providers = {};

function registerProvider(name, impl) {
  providers[name] = impl;
}

function getProvider(name) {
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Payment provider "${name}" not found`);
  }
  return provider;
}

export async function createPayment(order, method) {
  const providerName = process.env.PAYMENT_PROVIDER || 'static';
  const provider = getProvider(providerName);
  return provider.createPayment(order, method);
}

export async function verifyPayment(paymentId) {
  const providerName = process.env.PAYMENT_PROVIDER || 'static';
  const provider = getProvider(providerName);
  return provider.verifyPayment(paymentId);
}

const xenditProvider = {
  async createPayment(order, method) {
    if (method === 'qris') {
      const apiKey = process.env.XENDIT_API_KEY;

      const externalId = `CHOPCHOP-${order._id}-${Date.now()}`;

      if (!apiKey) {
        const qrString = `CHOPCHOP:${order._id}:${order.totalPrice}:${Date.now()}`;
        return {
          success: true,
          data: {
            qrString,
            xenditQrId: `demo-${order._id}`,
            externalId,
            amount: order.totalPrice,
            status: 'ACTIVE',
            expiryMinutes: 60
          }
        };
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const callbackUrl = `${baseUrl}/api/payments/xendit-webhook`;
      const auth = Buffer.from(apiKey + ':').toString('base64');

      const response = await fetch('https://api.xendit.co/qr_codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
          'api-version': '2022-07-31'
        },
        body: JSON.stringify({
          reference_id: externalId,
          type: 'DYNAMIC',
          currency: 'IDR',
          amount: order.totalPrice,
          callback_url: callbackUrl
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || JSON.stringify(data));
      }

      return {
        success: true,
        data: {
          qrString: data.qr_string,
          xenditQrId: data.id,
          externalId,
          amount: data.amount,
          status: data.status,
          expiryMinutes: 60,
          channelCode: data.channel_code
        }
      };
    }
    return { success: true, data: { method: 'cash' } };
  },

  async verifyPayment(paymentId) {
    return { success: true, data: { status: 'verified' } };
  }
};

const staticProvider = {
  async createPayment(order, method) {
    if (method === 'qris') {
      return {
        success: true,
        data: {
          qrImageUrl: '/images/qr_payment.png',
          externalId: `STATIC-${order._id}`,
          amount: order.totalPrice,
          expiryMinutes: 60
        }
      };
    }
    return { success: true, data: { method: 'cash' } };
  },

  async verifyPayment(paymentId) {
    return { success: true, data: { status: 'verified' } };
  }
};

registerProvider('static', staticProvider);
registerProvider('xendit', xenditProvider);
