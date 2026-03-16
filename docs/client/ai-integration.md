# Vercel AI SDK Integration

AI-powered insights integrated directly into workforce analytics pages. Built with **Vercel AI SDK**, **Claude 3.5 Sonnet**, and streaming responses.

## Features

### Analysis Types

1. **Hiring Gap Analysis** (`hiring-gap`)
   - Identifies skill gaps and hiring needs
   - Recommends recruitment strategy
   - Priority-level suggestions

2. **Data Insights** (`data-insights`)
   - Pattern recognition in employee data
   - Trend analysis
   - Anomaly detection

3. **Capacity Analysis** (`capacity-analysis`)
   - Workload distribution insights
   - Utilization rate analysis
   - Resource optimization recommendations

4. **Workforce Summary** (`workforce-summary`)
   - High-level organizational overview
   - Key metrics and statistics
   - Emerging trends and patterns

## Architecture

### API Route: `/api/ai/analyze`

**Endpoint:** `POST /api/ai/analyze`

**Request:**

```json
{
  "type": "hiring-gap" | "data-insights" | "capacity-analysis" | "workforce-summary",
  "context": { /* relevant data */ }
}
```

**Response:** Server-Sent Events (SSE) stream with real-time text generation

**Authentication:** Requires valid session (better-auth)

### Frontend Hook: `useAIAnalysis`

```typescript
import { useAIAnalysis } from "@/features/common/ai";

const { isLoading, error, response, analyze } = useAIAnalysis({
  type: "hiring-gap",
  context: {
    /* data */
  },
});

// Trigger analysis
await analyze();
```

### UI Component: `AIInsightPanel`

Pre-built, reusable component for displaying AI insights:

```typescript
import { AIInsightPanel } from "@/features/common/ai";

<AIInsightPanel
  type="hiring-gap"
  context={{ departmentStats, employeeData }}
  title="Custom Title"
  description="Optional description"
  autoAnalyze={true} // Auto-run analysis on mount
/>
```

## Usage Examples

### In Hiring Analytics Page

```typescript
import { HiringAnalyticsView } from "@/features/analytics/hiring-analytics/ui";

export default function HiringPage() {
  return (
    <HiringAnalyticsView
      departmentStats={...}
      employeeData={...}
      vacancies={...}
    />
  );
}
```

### In Dashboard

```typescript
import { DashboardAIInsights } from "@/features/analytics/common/ui";

export default function Dashboard() {
  return (
    <DashboardAIInsights
      companyMetrics={...}
      departmentMetrics={...}
      employeeMetrics={...}
    />
  );
}
```

## Setup

### 1. Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=your_api_key_here
```

Get your API key from [Anthropic Console](https://console.anthropic.com/)

### 2. Install Dependencies

```bash
npm install ai @ai-sdk/anthropic
```

### 3. Add to Pages

Embed `AIInsightPanel` components in analytics/dashboard pages.

## Configuration

### Model

Currently using **Claude 3.5 Sonnet** (`claude-3-5-sonnet-20241022`)

- Token limit: 200K input, 4K output per request
- Speed: Fast streaming responses
- Cost: Optimized for performance

### Customization

Modify prompts in `/app/api/ai/analyze/route.ts`:

```typescript
function buildHiringGapPrompt(company: any): string {
  return `Your custom system prompt here...`;
}
```

## Data Flow

```
Frontend Component
    ↓
useAIAnalysis Hook (streaming)
    ↓
POST /api/ai/analyze
    ↓
Check Session (better-auth)
    ↓
Fetch Company Context (Prisma)
    ↓
Claude 3.5 Sonnet (streamed)
    ↓
SSE Response
    ↓
Display in AIInsightPanel
```

## Performance

- **Streaming:** Real-time response display while generating
- **Authentication:** Session-based with company context isolation
- **Caching:** Responses not cached (real-time analysis)
- **Timeout:** 60 seconds per request

## Error Handling

All errors are caught and surfaced to the UI:

- Unauthorized (401): No valid session
- Not Found (404): Actor/company not found
- Server Error (500): AI generation failure

## Future Enhancements

- [ ] Response caching for repeated queries
- [ ] User feedback on insight quality
- [ ] Custom prompt templates per company
- [ ] Scheduled batch analysis
- [ ] Insight history and trending
- [ ] Multi-turn conversations
