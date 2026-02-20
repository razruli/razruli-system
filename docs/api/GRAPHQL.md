# GraphQL API Documentation

## Overview

The Gruzin platform exposes all functionality through a unified GraphQL endpoint:

**Production:** `https://api.gruzin.com/graphql`
**Development:** `http://localhost:3000/api/graphql`

---

## Authentication

All queries and mutations require a valid session. Authentication is handled via NextAuth:

```typescript
// Automatic in resolvers
ctx.user  // Current authenticated user
ctx.logger.info()  // Request logger
```

**Unauthenticated Request:**
```graphql
query {
  getFreight(id: "123") {  # Will error - requires auth
    id
  }
}
```

**Error Response:**
```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

---

## Core Types

### **Freight**

**State:** DRAFT → AVAILABLE → CLAIMED → ASSIGNED → IN_TRANSIT → DELIVERED → ARCHIVED

```graphql
type Freight {
  id: ID!
  freightNumber: String!
  status: String!          # DRAFT, AVAILABLE, CLAIMED, etc.
  freightOwner: FreightOwner!
  description: String!
  pickupLocation: Location!
  dropoffLocation: Location!
  shipments: [Shipment!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Location {
  latitude: Float!
  longitude: Float!
  address: String
}
```

### **Shipment**

**State:** POSTED → BIDDING_OPEN → BIDS_RECEIVED → BID_SELECTED → IN_PLANNING → IN_TRANSIT → DELIVERED

```graphql
type Shipment {
  id: ID!
  shipmentNumber: String!
  status: String!          # POSTED, BIDDING_OPEN, etc.
  broker: Broker
  creatingCarrier: Carrier
  freights: [Freight!]!
  stops: [ShipmentStop!]!
  bids: [ShipmentBid!]!
  selectedBid: ShipmentBid
  contract: BrokerCarrierContract
  events: [ShipmentEvent!]!
  createdAt: DateTime!
}
```

### **ShipmentBid**

**State:** PENDING → RULE_EVAL → (COMPLIANT | NON_COMPLIANT) → ACCEPTED

```graphql
type ShipmentBid {
  id: ID!
  shipment: Shipment!
  bidder: User!            # Carrier or Broker
  compliance: String!      # PENDING, COMPLIANT, NON_COMPLIANT
  price: Decimal!
  estimatedDays: Int!
  status: String!          # ACCEPTED, REJECTED, WITHDRAWN
  createdAt: DateTime!
}
```

---

## Queries

### **Freight Queries**

```graphql
# Get single freight
query GetFreight {
  getFreight(id: "fr-123") {
    id
    freightNumber
    status
    description
  }
}

# List available freight
query ListAvailableFreight {
  listAvailableFreights(
    limit: 50
    offset: 0
  ) {
    id
    freightNumber
    pickupLocation { latitude, longitude }
    dropoffLocation { latitude, longitude }
  }
}

# Search freight by filters
query SearchFreight {
  searchFreights(
    filters: {
      status: "AVAILABLE"
      createdAfter: "2024-01-01"
    }
    limit: 50
  ) {
    id
    freightNumber
    status
  }
}
```

### **Shipment Queries**

```graphql
# List open shipments (for bidding)
query ListOpenShipments {
  listShipments(
    filter: { status: "BIDDING_OPEN" }
    limit: 50
  ) {
    id
    shipmentNumber
    freights { freightNumber, description }
    bids {
      id
      bidder { firstName, lastName }
      compliance
      price
    }
  }
}

# Get shipment with all details
query GetShipmentDetails {
  getShipment(id: "sp-456") {
    id
    status
    selectedBid {
      id
      price
    }
    stops {
      id
      sequence
      location { address }
      plannedArrival
    }
  }
}
```

### **Bid Queries**

```graphql
# List all bids for a shipment
query GetShipmentBids {
  getBidsForShipment(shipmentId: "sp-456") {
    id
    bidder { companyName }
    compliance
    price
    estimatedDays
    termsAgreed
  }
}

# Get compliant bids only
query GetCompliantBids {
  listCompliantBids(shipmentId: "sp-456") {
    id
    price
    bidder { companyName, avgRating }
  }
}
```

---

## Mutations

### **Freight Mutations**

```graphql
# Create freight
mutation CreateFreight {
  createFreight(input: {
    freightNumber: "FR-001"
    description: "Electronics shipment"
    pickupLocation: {
      latitude: 40.7128
      longitude: -74.0060
      address: "New York"
    }
    dropoffLocation: {
      latitude: 34.0522
      longitude: -118.2437
      address: "Los Angeles"
    }
  }) {
    id
    status
    freightNumber
  }
}

# Publish freight (DRAFT → AVAILABLE)
mutation PublishFreight {
  publishFreight(id: "fr-123") {
    id
    status
    description
  }
}

# Claim freight (AVAILABLE → CLAIMED)
mutation ClaimFreight {
  claimFreight(id: "fr-123") {
    id
    status
    brokerClaimed
  }
}

# Cancel freight
mutation CancelFreight {
  cancelFreight(id: "fr-123", reason: "Owner request") {
    id
    status
  }
}
```

### **Shipment Mutations**

```graphql
# Create shipment
mutation CreateShipment {
  createShipment(input: {
    shipmentNumber: "SP-001"
    freightIds: ["fr-123"]
  }) {
    id
    status
  }
}

# Open bidding
mutation OpenBidding {
  openBidding(shipmentId: "sp-456") {
    id
    status
  }
}

# Submit bid
mutation SubmitBid {
  submitBid(input: {
    shipmentId: "sp-456"
    price: 5000.00
    estimatedDays: 2
    fullTerms: true
    termsAgreed: ["PAYMENT_30", "NO_SUBCONTRACT"]
  }) {
    id
    compliance
    complianceReason
  }
}

# Select winning bid
mutation SelectBid {
  selectBid(shipmentId: "sp-456", bidId: "bid-789") {
    id
    status
    selectedBid { id, bidder { companyName } }
  }
}

# Plan routes (add stops)
mutation PlanRoutes {
  planRoutes(shipmentId: "sp-456", stops: [
    {
      sequence: 1
      location: { latitude: 40.7128, longitude: -74.0060 }
      stopType: "PICKUP"
      plannedArrival: "2024-02-22T10:00:00Z"
    },
    {
      sequence: 2
      location: { latitude: 34.0522, longitude: -118.2437 }
      stopType: "DROPOFF"
      plannedArrival: "2024-02-24T15:00:00Z"
    }
  ]) {
    id
    status
    stops { id, sequence, status }
  }
}

# Start transit
mutation StartTransit {
  startTransit(shipmentId: "sp-456") {
    id
    status
  }
}

# Complete a stop (driver action)
mutation CompleteStop {
  completeStop(shipmentId: "sp-456", stopId: "stop-123", proof: {
    type: "PHOTO"
    url: "s3://bucket/proof.jpg"
  }) {
    id
    status
    completionProof
  }
}

# Complete shipment
mutation CompleteShipment {
  completeShipment(shipmentId: "sp-456") {
    id
    status
  }
}
```

### **Bid Rule Mutations**

```graphql
# Create bid rule (automatic validation rules)
mutation CreateBidRule {
  createBidRule(input: {
    shipmentId: "sp-456"
    type: "PRICE_RANGE"
    minValue: 4000
    maxValue: 6000
  }) {
    id
    type
  }
}
```

---

## Error Handling

### **Error Types**

```graphql
# Validation error
{
  "errors": [{
    "message": "Price must be > 0",
    "extensions": {
      "code": "VALIDATION_ERROR",
      "details": { "field": "price" }
    }
  }]
}

# Not found error
{
  "errors": [{
    "message": "Freight not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}

# Unauthorized error
{
  "errors": [{
    "message": "Cannot modify other user's shipment",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```

---

## Pagination

All list queries support pagination:

```graphql
query {
  listShipments(
    filter: {}
    limit: 50        # Default: 50, Max: 100
    offset: 0        # Default: 0 (number of items to skip)
  ) {
    id
    shipmentNumber
    pageInfo {
      total: 147
      hasMore: true
    }
  }
}
```

---

## Subscriptions

*Planned for Phase 12 - Real-time updates*

```graphql
# Subscribe to shipment status changes
subscription OnShipmentStatusChanged {
  shipmentStatusChanged(shipmentId: "sp-456") {
    shipmentId
    oldStatus: "IN_PLANNING"
    newStatus: "IN_TRANSIT"
    timestamp: "2024-02-22T10:00:00Z"
  }
}
```

---

## Rate Limiting

- **Authenticated:** 1000 requests/hour
- **Unauthenticated:** 100 requests/hour

Headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1613923200
```

---

## Testing Queries

### **Test Authentication**

```bash
curl -X POST http://localhost:3000/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ me { id, email } }"
  }' \
  -H "Cookie: <your-session-cookie>"
```

### **Test GraphQL Playground**

```
http://localhost:3000/api/graphql
```

Browser-based IDE with:
- Query documentation
- Auto-completion
- Variable editor
- Response inspector

---

## GraphQL Schema Reference

**Generated:** [shared/graphql/generated/graphql.ts](../shared/graphql/generated/graphql.ts)

**Source:** [server/graphql/schema/typedefs.graphql](../server/graphql/schema/typedefs.graphql)

**Update:**
```bash
npm run codegen:graphql
```

---

## Common Patterns

### **Deeply Nested Queries**

```graphql
query GetShipmentWithAllDetails {
  getShipment(id: "sp-456") {
    id
    shipmentNumber
    status
    
    # Linked freight
    freights {
      id
      freightNumber
      freightOwner { companyName }
    }
    
    # Bidding details
    bids {
      id
      bidder { companyName, avgRating }
      compliance
      price
    }
    selectedBid {
      id
      price
      bidder { id }
    }
    
    # Route planning
    stops {
      id
      sequence
      location { address }
      status
      plannedArrival
      actualArrival
    }
    
    # Audit trail
    events {
      id
      eventType
      createdAt
    }
  }
}
```

### **Filtering & Sorting**

```graphql
query SearchWithFilters {
  listShipments(
    filter: {
      status: "BIDDING_OPEN"
      createdAfter: "2024-01-01"
      createdBefore: "2024-03-01"
      brokerIds: ["broker-123"]
    }
    sort: "createdAt"
    order: "DESC"
    limit: 50
  ) {
    id
    shipmentNumber
  }
}
```

---

## Support

- **GraphQL Playground:** http://localhost:3000/api/graphql
- **Schema:** See [typedefs.graphql](../server/graphql/schema/typedefs.graphql)
- **Generated Types:** [graphql.ts](../shared/graphql/generated/graphql.ts)
- **Issues:** Check [CURRENT_STATE.md](../docs/status/CURRENT_STATE.md)
