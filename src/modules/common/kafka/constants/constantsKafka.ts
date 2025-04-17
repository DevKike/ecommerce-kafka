export const CONSTANT_KAFKA = {
  SOURCE: {
    USER_SERVICE: 'UserService',
    PRODUCT_SERVICE: 'ProductService',
    CART_SERVICE: 'CartService',
    NOTIFICATION_SERVICE: 'NotificationService',
    PAYMENT_SERVICE: 'OrderService',
    BILLING_SERVICE: 'BillingService',
  },

  TOPIC: {
    USER: {
      WELCOME_FLOW: 'welcome_flow',
      LOGIN: 'user_login',
    },
    PRODUCT: {
      CREATED: 'product_created',
    },
    CART: {
      CHECKOUT: 'cart_checkout',
      UPDATED: 'cart_updates',
      REMOVED: 'cart-removals',
    },
    NOTIFICATION: {
      EMAIL: 'email_notification',
    },
    PAYMENT: {
      CREATED: 'order_created',
    },
    INVOICE: {
      PROCESSING: 'invoice_processing',
    },
  },
};
