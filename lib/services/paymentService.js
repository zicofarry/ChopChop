import crypto from 'crypto';

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

const staticProvider = {
  async createPayment(order, method) {
    if (method === 'qris') {
      return {
        success: true,
        data: {
          qrCodeUrl: '/images/qr-payment.png',
          orderId: order._id,
          amount: order.totalPrice,
          expiryMinutes: 60,
          referenceId: `QR-${order._id}-${Date.now()}`
        }
      };
    }
    return { success: true, data: { method: 'cash' } };
  },

  async verifyPayment(paymentId) {
    return {
      success: true,
      data: { status: 'verified' }
    };
  }
};

registerProvider('static', staticProvider);
