# Proyecto E-commerce con Kafka

## Descripción

Este proyecto es una aplicación de comercio electrónico (e-commerce) que utiliza **Apache Kafka** como sistema de mensajería para implementar una arquitectura basada en eventos. A continuación, se presentan sus principales características.

---

## 🧱 Arquitectura

- **Patrón de Eventos**: Comunicación asíncrona entre servicios utilizando Apache Kafka como broker de mensajes.
- **Microservicios**: La aplicación está dividida en varios módulos funcionales:
  - Usuarios
  - Productos
  - Carrito
  - Pagos
  - Notificaciones
- **Base de Datos**: MongoDB para almacenamiento persistente de datos.

---

## 🧩 Principales Módulos

- **Autenticación (auth)**: Manejo de registro y login de usuarios.
- **Productos**: Catálogo de productos disponibles.
- **Carrito (cart)**: Gestión del carrito de compras.
- **Pagos (payments)**: Procesamiento de órdenes y generación de facturas.
- **Notificaciones**: Envío de correos electrónicos a usuarios.

---

## 🔄 Flujos de Eventos Principales

- **Registro de Usuario**: Al registrarse un usuario, se publica un evento `welcome_flow` que desencadena el envío de un correo de bienvenida.
- **Gestión de Carrito**: Al añadir o eliminar productos, se publican eventos `cart_updates` y `cart_removals`.
- **Procesamiento de Órdenes**: Al crear una orden, se generan eventos para procesar el pago y emitir la factura.
- **Notificaciones**: Los eventos generan correos automáticos para acciones como bienvenida, eliminación de carrito o facturas.

---

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js con TypeScript
- **Mensajería**: Apache Kafka
- **Base de Datos**: MongoDB
- **Correo Electrónico**: Nodemailer
- **Contenedores**: Docker para Kafka, Zookeeper y MongoDB
- **Autenticación**: JSON Web Tokens (JWT)

---

## 👨‍💻 Integrantes del Proyecto

- Sahir Ruiz Taborda  
- Martin Escudero Hernández  
- Jared Trujillo Espinosa  
- Álvaro Narváez Escorcia  

---

## 🚀 Objetivo

Implementar un sistema e-commerce escalable, mantenible y desacoplado, aprovechando los beneficios de la arquitectura orientada a eventos.
