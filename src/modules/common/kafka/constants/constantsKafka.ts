export const CONSTANT_KAFKA = {
  SOURCE: {
    USER_SERVICE: 'UserService',
    PRODUCT_SERVICE: 'ProductService',
    CART_SERVICE: 'CartService',
    NOTIFICATION_SERVICE: 'NotificationService',
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
      UPDATED: 'cart_updates',
    },
    NOTIFICATION: {
      EMAIL: 'email_notification',
    },
  },
}
