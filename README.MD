# 🏘️ Estate Search Engine: Middle-end Guide

_node.js, express, JWT, Jest, JavaScript, MongoDB, mongoose, Backend_

## 📔 Description

This repository corresponds to the **_node.js_** backend service responsible to handle the frontend requests and either serve them directly (_clients_) or forward them to another service built in **_Laravel_** (_properties_).

At the same time, it will also serve responses to requests made from the **_Laravel_** service concerning clients' purchase history (_purchases_).

---

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload
npm run dev

# serve for production
npm run start

# migrate the database from zero
npm run migrate
```

---

## General API Information

- All endpoints return a JSON object with the following format

```javascript
// If everything went ok
{
  data: [{...}],
  error: null
}

// In case an error occurs
{
  data: null,
  error: "Error message"
}
```

---

## HTTP Return Codes

- HTTP `400` return code is used for malformed requests; the issue is on the sender's side.
- HTTP `401` return code is used when trying to access a protected endpoint without providing a JWT.
- HTTP `403` return code is used when trying to access a protected endpoint with an invalid JWT.
- HTTP `500` return code is used for internal errors; the issue is on the API side.

---

## Public API Endpoints

### Register

```
POST /register
```

Registers a new user.

**Parameters:**

```javascript
{
  "email" : "valid@email.com",
  "name" : "Username",
  "password" : "anypassword"
}
```

**Response:**

```javascript
{
  "data": "Congratulations, you have been successfully registered!",
  "error": null
}
```

---

### Login

```
POST /login
```

Returns a JWT for an existing user.

**Parameters:**

```javascript
{
  "email": "registered@email.com",
  "password": "validpassword"
}
```

**Response:**

```javascript
{
  "data": {
    "accessToken": "...",
    "client": {...}
  },
  "error": null
}
```

---
