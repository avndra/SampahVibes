# RecycleVibes - System Diagrams

Dokumen ini berisi diagram sistem untuk aplikasi RecycleVibes dalam format Mermaid.

---

## 1. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ ACTIVITY : "has"
    USER ||--o{ TRANSACTION : "makes"
    USER ||--o{ NOTIFICATION : "receives"
    USER }o--o{ PRODUCT : "cart contains"
    PRODUCT ||--o{ TRANSACTION : "purchased in"
    PRODUCT ||--o{ ACTIVITY : "related to"

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string avatar
        string role "user/admin"
        number totalPoints
        number totalWeight
        number totalDeposits
        array cart
        date createdAt
    }

    PRODUCT {
        ObjectId _id PK
        string name
        string description
        string category
        number pointsCost
        number stock
        string image
        boolean isActive
        date createdAt
    }

    ACTIVITY {
        ObjectId _id PK
        ObjectId userId FK
        string type "earn/redeem/scan"
        number points
        ObjectId productId FK
        string productName
        string status "pending/approved/shipped/completed/rejected"
        object shippingAddress
        string adminNote
        date timestamp
    }

    TRANSACTION {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId productId FK
        string productName
        string productImage
        number pointsCost
        number quantity
        number totalPoints
        string status "pending/processing/shipped/completed/cancelled"
        object shippingData
        string trackingNumber
        date createdAt
    }

    NOTIFICATION {
        ObjectId _id PK
        ObjectId userId FK
        string type "order_update/system/promo"
        string title
        string message
        boolean read
        string link
        date createdAt
    }

    ADMIN_ACTIVITY {
        ObjectId _id PK
        ObjectId adminId FK
        string action
        string targetType
        ObjectId targetId
        object details
        date createdAt
    }
```

---

## 2. Data Flow Diagram (DFD)

### DFD Level 0 - Context Diagram

```mermaid
flowchart LR
    subgraph External["External Entities"]
        U[("👤 User")]
        A[("🛡️ Admin")]
    end

    subgraph System["RecycleVibes System"]
        S[["🌱 RecycleVibes Platform"]]
    end

    U -->|"Scan Barcode"| S
    U -->|"Redeem Points"| S
    U -->|"View Products"| S
    S -->|"Points & Notifications"| U
    S -->|"Products & Receipts"| U

    A -->|"Manage Products"| S
    A -->|"Update Order Status"| S
    S -->|"Reports & Orders"| A
```

### DFD Level 1 - Main Processes

```mermaid
flowchart TB
    subgraph External
        U[("👤 User")]
        A[("🛡️ Admin")]
    end

    subgraph Processes
        P1["1.0<br/>User Authentication"]
        P2["2.0<br/>Barcode Scanning"]
        P3["3.0<br/>Point Management"]
        P4["4.0<br/>Product Redemption"]
        P5["5.0<br/>Order Management"]
        P6["6.0<br/>Notification System"]
    end

    subgraph DataStores
        D1[("D1: Users")]
        D2[("D2: Products")]
        D3[("D3: Activities")]
        D4[("D4: Transactions")]
        D5[("D5: Notifications")]
    end

    U -->|"Login/Register"| P1
    P1 -->|"User Data"| D1

    U -->|"Scan Request"| P2
    P2 -->|"Activity Log"| D3
    P2 -->|"Update Points"| P3

    P3 -->|"Points Update"| D1

    U -->|"Purchase Request"| P4
    P4 -->|"Check Stock"| D2
    P4 -->|"Create Transaction"| D4
    P4 -->|"Log Activity"| D3
    P4 -->|"Deduct Points"| P3

    A -->|"Update Status"| P5
    P5 -->|"Update Order"| D3
    P5 -->|"Trigger Notification"| P6

    P6 -->|"Store Notification"| D5
    D5 -->|"Notifications"| U
```

### DFD Level 2 - Barcode Scanning Process (2.0)

```mermaid
flowchart TB
    subgraph External
        U[("👤 User")]
        PS[("Python<br/>Scanner API")]
    end

    subgraph "Process 2.0: Barcode Scanning"
        P2_1["2.1<br/>Capture Image"]
        P2_2["2.2<br/>Send to Scanner API"]
        P2_3["2.3<br/>Validate Barcode"]
        P2_4["2.4<br/>Calculate Points"]
        P2_5["2.5<br/>Update User Points"]
        P2_6["2.6<br/>Log Activity"]
    end

    subgraph DataStores
        D1[("D1: Users")]
        D3[("D3: Activities")]
    end

    U -->|"Camera Image"| P2_1
    P2_1 -->|"Image Data"| P2_2
    P2_2 -->|"Barcode Request"| PS
    PS -->|"Product Info"| P2_3
    P2_3 -->|"Valid Product"| P2_4
    P2_4 -->|"Points Value"| P2_5
    P2_5 -->|"Update Points"| D1
    P2_5 -->|"Scan Data"| P2_6
    P2_6 -->|"Activity Record"| D3
    P2_6 -->|"Success Response"| U
```

### DFD Level 2 - Product Redemption Process (4.0)

```mermaid
flowchart TB
    subgraph External
        U[("👤 User")]
    end

    subgraph "Process 4.0: Product Redemption"
        P4_1["4.1<br/>Verify User Points"]
        P4_2["4.2<br/>Check Product Stock"]
        P4_3["4.3<br/>Validate Shipping Info"]
        P4_4["4.4<br/>Deduct Points"]
        P4_5["4.5<br/>Update Stock"]
        P4_6["4.6<br/>Create Transaction"]
        P4_7["4.7<br/>Log Activity"]
        P4_8["4.8<br/>Generate Receipt"]
    end

    subgraph DataStores
        D1[("D1: Users")]
        D2[("D2: Products")]
        D3[("D3: Activities")]
        D4[("D4: Transactions")]
    end

    U -->|"Purchase Request"| P4_1
    D1 -->|"User Points"| P4_1
    P4_1 -->|"Sufficient Points"| P4_2
    D2 -->|"Stock Info"| P4_2
    P4_2 -->|"Stock Available"| P4_3
    U -->|"Shipping Data"| P4_3
    P4_3 -->|"Valid Address"| P4_4
    P4_4 -->|"Update Points"| D1
    P4_4 -->|"Proceed"| P4_5
    P4_5 -->|"Update Stock"| D2
    P4_5 -->|"Proceed"| P4_6
    P4_6 -->|"Transaction Record"| D4
    P4_6 -->|"Proceed"| P4_7
    P4_7 -->|"Activity Record"| D3
    P4_7 -->|"Proceed"| P4_8
    P4_8 -->|"Receipt/PDF"| U
```

---

## 3. Activity Diagram - User Purchase Flow

```mermaid
flowchart TD
    Start([Start]) --> A1[User Opens Shop Page]
    A1 --> A2[User Selects Product]
    A2 --> A3{User Logged In?}
    
    A3 -->|No| A4[Redirect to Login]
    A4 --> A5[User Logs In]
    A5 --> A2
    
    A3 -->|Yes| A6[View Product Detail]
    A6 --> A7[Select Quantity]
    A7 --> A8[Click Buy Now]
    
    A8 --> A9{Has Enough Points?}
    A9 -->|No| A10[Show Error: Insufficient Points]
    A10 --> End1([End])
    
    A9 -->|Yes| A11{Location Verified?}
    A11 -->|No| A12[Request Location Permission]
    A12 --> A13{Permission Granted?}
    A13 -->|No| A14[Show Manual Address Form]
    A13 -->|Yes| A15[Auto-fill Address from GPS]
    A14 --> A16[User Fills Address]
    A15 --> A17[Confirm Address]
    A16 --> A17
    
    A11 -->|Yes| A17
    A17 --> A18[Open Checkout Modal]
    A18 --> A19[User Confirms Purchase]
    
    A19 --> A20[Deduct User Points]
    A20 --> A21[Reduce Product Stock]
    A21 --> A22[Create Transaction Record]
    A22 --> A23[Create Activity Log]
    A23 --> A24[Show Success Modal with Receipt]
    A24 --> A25{Download PDF?}
    
    A25 -->|Yes| A26[Generate & Download PDF]
    A26 --> A27[Redirect to Profile]
    A25 -->|No| A27
    
    A27 --> End2([End])
```

---

## 4. Activity Diagram - Admin Order Management

```mermaid
flowchart TD
    Start([Start]) --> B1[Admin Opens Orders Page]
    B1 --> B2[View All Orders]
    B2 --> B3[Select Order to Manage]
    B3 --> B4[Open Order Detail Modal]
    
    B4 --> B5{Select Action}
    
    B5 -->|Approve| B6[Set Status: Approved]
    B5 -->|Ship| B7[Set Status: Shipped]
    B5 -->|Complete| B8[Set Status: Completed]
    B5 -->|Reject| B9[Set Status: Rejected]
    
    B6 --> B10[Add Admin Note]
    B7 --> B10
    B8 --> B10
    B9 --> B10
    
    B10 --> B11[Update Order in Database]
    B11 --> B12{Status is Shipped/Completed/Rejected?}
    
    B12 -->|Yes| B13[Create Notification for User]
    B13 --> B14[Save Notification to Database]
    B14 --> B15[Show Success Toast]
    
    B12 -->|No| B15
    
    B15 --> B16[Refresh Order List]
    B16 --> End([End])
```

---

## 5. Activity Diagram - Barcode Scanning

```mermaid
flowchart TD
    Start([Start]) --> C1[User Opens Scan Modal]
    C1 --> C2{Camera Permission?}
    
    C2 -->|No| C3[Request Camera Access]
    C3 --> C4{Permission Granted?}
    C4 -->|No| C5[Show Error Message]
    C5 --> End1([End])
    C4 -->|Yes| C6[Activate Camera]
    
    C2 -->|Yes| C6
    C6 --> C7[User Points Camera at Barcode]
    C7 --> C8[Capture Image]
    C8 --> C9[Send to Python Scanner API]
    
    C9 --> C10{Valid Barcode?}
    C10 -->|No| C11[Show Error: Invalid Barcode]
    C11 --> C7
    
    C10 -->|Yes| C12[Calculate Points from Weight]
    C12 --> C13[Display Product Info]
    C13 --> C14[User Confirms Deposit]
    
    C14 --> C15[Add Points to User Account]
    C15 --> C16[Create Activity Log]
    C16 --> C17[Show Success with Confetti]
    C17 --> C18[Update User Stats Display]
    C18 --> End2([End])
```

---

> **Note:** Diagram ini dibuat dalam format Mermaid dan dapat di-export ke draw.io atau tools diagram lainnya.
