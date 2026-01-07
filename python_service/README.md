---
title: E-Recycle Barcode Scanner API
emoji: ♻️
colorFrom: green
colorTo: blue
sdk: docker
pinned: false
license: mit
---

# E-Recycle Barcode Scanner API

FastAPI service untuk scan barcode botol plastik dan menghitung poin daur ulang.

## Endpoints

### GET /
Health check endpoint.

### POST /scan-barcode
Scan barcode dan dapatkan info produk + poin.

**Request:**
```json
{
  "code": "8996001600399"
}
```

**Response:**
```json
{
  "barcode": "8996001600399",
  "trashType": "Botol Plastik (PET)",
  "productName": "Le Minerale 1500ml",
  "weight": 0.035,
  "pointsEarned": 35,
  "message": "Verified: Le Minerale 1500ml"
}
```
