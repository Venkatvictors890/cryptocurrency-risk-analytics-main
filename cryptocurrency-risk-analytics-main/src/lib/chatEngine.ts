/**
 * Local AI Chat Engine — Rule-based cryptocurrency knowledge assistant.
 *
 * Provides context-aware responses about:
 * - Cryptocurrency risk analysis
 * - Safe investments & market trends
 * - Platform features & terminology
 * - Beginner-friendly explanations
 */

import type { CryptoAsset } from "@/types/crypto";

interface ChatContext {
  coin?: CryptoAsset | null;
  allCoins?: CryptoAsset[];
}

interface KnowledgeEntry {
  keywords: string[];
  response: string | ((ctx: ChatContext) => string);
  priority?: number;
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // ── Risk Score ───────────────────────────────────────────────
  {
    keywords: ["risk score", "risk rating", "what is risk", "risk mean", "risk number"],
    priority: 10,
    response: (ctx) => {
      const coinInfo = ctx.coin
        ? `\n\n**${ctx.coin.name}** currently has a risk score of **${ctx.coin.riskScore}/100** (${ctx.coin.riskLevel} risk).`
        : "";
      return `## 📊 Risk Score Explained

The **Risk Score** is a composite number from **0 to 100** that measures how risky a cryptocurrency is:

| Score Range | Level | Meaning |
|-------------|-------|---------|
| 0 – 35 | 🟢 Low | Relatively stable, lower chance of sudden drops |
| 36 – 65 | 🟡 Moderate | Average risk, some price swings expected |
| 66 – 100 | 🔴 High | Very volatile, potential for large gains or losses |

It's calculated from **5 weighted factors**:
1. **Volatility** (30%) — How much the price swings
2. **Liquidity** (25%) — How easily you can buy/sell
3. **Social Sentiment** (20%) — Public mood on social media
4. **News Impact** (15%) — Effect of recent news
5. **Transaction Behavior** (10%) — On-chain activity patterns${coinInfo}`;
    },
  },

  // ── Volatility ───────────────────────────────────────────────
  {
    keywords: ["volatility", "volatile", "price swing", "fluctuation", "price change"],
    priority: 8,
    response: (ctx) => {
      const coinInfo = ctx.coin
        ? `\n\n**${ctx.coin.name}** volatility score: **${ctx.coin.volatilityScore}/100** — ${ctx.coin.volatilityScore > 65 ? "highly volatile ⚠️" : ctx.coin.volatilityScore > 35 ? "moderately volatile" : "relatively stable ✅"}.`
        : "";
      return `## 📈 Volatility Explained

**Volatility** measures how much a cryptocurrency's price moves up and down over time.

- **High volatility** = big price swings (both up and down). More potential profit but also more risk.
- **Low volatility** = steadier prices. Safer but lower potential returns.

### How we measure it:
We use the **coefficient of variation** from 7-day price data (sparkline). This captures short-term price behavior.

### For beginners:
Think of it like a rollercoaster 🎢 — high volatility = wild ride, low volatility = gentle slope.${coinInfo}`;
    },
  },

  // ── Liquidity ────────────────────────────────────────────────
  {
    keywords: ["liquidity", "liquid", "trading volume", "buy sell", "trade easily"],
    priority: 8,
    response: (ctx) => {
      const coinInfo = ctx.coin
        ? `\n\n**${ctx.coin.name}** liquidity score: **${ctx.coin.liquidityScore}/100** — ${ctx.coin.liquidityScore < 35 ? "highly liquid (easy to trade) ✅" : ctx.coin.liquidityScore < 65 ? "moderately liquid" : "low liquidity (harder to trade) ⚠️"}.`
        : "";
      return `## 💧 Liquidity Explained

**Liquidity** refers to how easily you can buy or sell a cryptocurrency without significantly affecting its price.

- **High liquidity** = lots of buyers and sellers, tight spreads, easy to trade
- **Low liquidity** = fewer traders, bigger price impact when you buy/sell, harder to exit positions

### How we measure it:
We calculate the **volume-to-market-cap ratio**. Higher ratio = more liquid. We invert the score so that **lower scores = better liquidity** (less risk).

### For beginners:
Imagine selling a popular item vs. a rare collectible 🏪 — popular items sell fast (high liquidity), rare items take time (low liquidity).${coinInfo}`;
    },
  },

  // ── Sentiment ────────────────────────────────────────────────
  {
    keywords: ["sentiment", "social media", "public opinion", "mood", "twitter", "reddit", "nlp"],
    priority: 8,
    response: (ctx) => {
      const coinInfo = ctx.coin
        ? `\n\n**${ctx.coin.name}** sentiment: **${ctx.coin.sentimentLabel}** (score: ${ctx.coin.sentimentScore.toFixed(2)})`
        : "";
      return `## 🎭 Sentiment Analysis Explained

**Sentiment** measures the overall public mood about a cryptocurrency based on:
- **Twitter/X** posts and discussions
- **Reddit** threads and comments
- **News articles** and headlines

### Sentiment Labels:
| Label | Score Range | Meaning |
|-------|-----------|---------|
| 🟢 Positive | > 0.15 | Bullish mood, people are optimistic |
| 🟡 Neutral | -0.15 to 0.15 | Mixed signals, market undecided |
| 🔴 Negative | < -0.15 | Bearish mood, concern or fear |

### How it affects price:
- Positive sentiment often correlates with price increases
- Negative sentiment can trigger sell-offs
- But sentiment alone shouldn't drive investment decisions!

### Technical detail:
In production, NLP models like VADER or TextBlob analyze text from social media APIs. Our platform uses market signals as a proxy.${coinInfo}`;
    },
  },

  // ── Safe investment ──────────────────────────────────────────
  {
    keywords: ["safe", "safest", "invest", "beginner", "recommend", "good buy", "should i buy", "best crypto"],
    priority: 9,
    response: (ctx) => {
      let recommendations = "";
      if (ctx.allCoins?.length) {
        const safe = [...ctx.allCoins]
          .filter((c) => c.riskLevel === "Low")
          .sort((a, b) => a.riskScore - b.riskScore)
          .slice(0, 5);
        if (safe.length > 0) {
          recommendations = "\n\n### Currently Low-Risk Assets:\n" +
            safe.map((c, i) => `${i + 1}. **${c.name}** (${c.symbol.toUpperCase()}) — Risk: ${c.riskScore}/100, Sentiment: ${c.sentimentLabel}`).join("\n");
        }
      }
      return `## 🛡️ Safe Cryptocurrency Investments

> ⚠️ **Disclaimer:** This is educational information, not financial advice. Always do your own research!

### For Beginners — Lower Risk Options:

1. **Bitcoin (BTC)** — Largest market cap, most institutional adoption, considered the "digital gold"
2. **Ethereum (ETH)** — Second largest, powers smart contracts and DeFi
3. **Stablecoins (USDT, USDC)** — Pegged to USD, minimal price fluctuation

### Investment Tips for Beginners:
- 📌 **Never invest more than you can afford to lose**
- 📌 **Diversify** — Don't put all your money in one coin
- 📌 **Dollar-cost averaging (DCA)** — Invest a fixed amount regularly
- 📌 **Look for low-risk scores** — Use our platform to identify safer assets
- 📌 **Check liquidity** — Ensure you can easily sell when needed
- 📌 **Research the team** — Who built it? Is it actively developed?${recommendations}`;
    },
  },

  // ── Market trends ────────────────────────────────────────────
  {
    keywords: ["trend", "market", "bull", "bear", "price direction", "going up", "going down", "prediction"],
    priority: 7,
    response: (ctx) => {
      let marketSummary = "";
      if (ctx.allCoins?.length) {
        const positive = ctx.allCoins.filter((c) => c.priceChangePercentage24h > 0).length;
        const total = ctx.allCoins.length;
        const pct = Math.round((positive / total) * 100);
        const avgChange = ctx.allCoins.reduce((s, c) => s + c.priceChangePercentage24h, 0) / total;
        marketSummary = `\n\n### Current Market Snapshot:\n- **${positive}/${total}** coins are in the green (${pct}%)\n- Average 24h change: **${avgChange > 0 ? "+" : ""}${avgChange.toFixed(2)}%**\n- Market sentiment: ${pct > 60 ? "🟢 Bullish" : pct > 40 ? "🟡 Mixed" : "🔴 Bearish"}`;
      }
      return `## 📊 Market Trends

### Understanding Market Cycles:

| Phase | Characteristics |
|-------|----------------|
| 🐂 **Bull Market** | Rising prices, positive sentiment, FOMO |
| 🐻 **Bear Market** | Falling prices, negative sentiment, fear |
| 🦀 **Crab Market** | Sideways movement, consolidation |

### Key Indicators We Track:
1. **Price Change %** — 24-hour momentum
2. **Volume** — Trading activity (rising volume = strong trend)
3. **Sentiment** — Public mood (leads price in some cases)
4. **Risk Heatmap** — Visual overview of market risk levels

### Tips for Reading Trends:
- Rising price + rising volume = strong uptrend ✅
- Rising price + falling volume = weakening trend ⚠️
- Look at multiple timeframes (1H, 1D, 1W) before making decisions${marketSummary}`;
    },
  },

  // ── Platform usage ───────────────────────────────────────────
  {
    keywords: ["how to use", "platform", "feature", "dashboard", "navigate", "help", "guide", "tutorial"],
    priority: 6,
    response: `## 🧭 Platform Guide

### Main Sections:

| Page | What It Does |
|------|-------------|
| 📊 **Dashboard** | Overview of top cryptocurrencies with stats, risk heatmap, and market sentiment |
| 📈 **Markets** | Browse all tracked coins with search, filter by risk level, and sort |
| 🔍 **Coin Detail** | Deep dive into any coin — price charts, volume, risk breakdown, sentiment feed |
| 📰 **News & Sentiment** | Global sentiment by region + latest crypto news |
| ⚖️ **Compare** | Side-by-side comparison of two cryptocurrencies |
| 🤖 **AI Assistant** | That's me! Ask anything about crypto risk and investing |
| 📁 **Archive** | Download historical data for any coin/year |
| 💾 **Repository** | Download source code and documentation |

### Quick Tips:
- Click any coin card to see its detailed analysis
- Use the **risk filter** in Markets to find safe investments
- Toggle **dark/light mode** in the top bar
- Use the **currency selector** to view prices in your preferred fiat currency (20 supported!)
- Charts show **green** for upward and **red** for downward movement`,
  },

  // ── Specific coin info ───────────────────────────────────────
  {
    keywords: ["bitcoin", "btc", "ethereum", "eth", "about this coin", "tell me about"],
    priority: 7,
    response: (ctx) => {
      if (ctx.coin) {
        const isUp = ctx.coin.priceChangePercentage24h >= 0;
        return `## ${ctx.coin.name} (${ctx.coin.symbol.toUpperCase()}) — Live Analysis

| Metric | Value |
|--------|-------|
| 💰 Price | $${ctx.coin.currentPrice.toLocaleString()} |
| 📊 24h Change | ${isUp ? "🟢" : "🔴"} ${isUp ? "+" : ""}${ctx.coin.priceChangePercentage24h.toFixed(2)}% |
| 🏛️ Market Cap | $${(ctx.coin.marketCap / 1e9).toFixed(2)}B |
| 📦 24h Volume | $${(ctx.coin.totalVolume / 1e9).toFixed(2)}B |
| ⚠️ Risk Score | ${ctx.coin.riskScore}/100 (${ctx.coin.riskLevel}) |
| 🎭 Sentiment | ${ctx.coin.sentimentLabel} (${ctx.coin.sentimentScore.toFixed(2)}) |

### Risk Breakdown:
- Volatility: ${ctx.coin.volatilityScore}/100
- Liquidity: ${ctx.coin.liquidityScore}/100
- Social Sentiment: ${ctx.coin.socialSentimentScore}/100
- News Impact: ${ctx.coin.newsImpactScore}/100
- Transaction Behavior: ${ctx.coin.transactionBehaviorScore}/100

${ctx.coin.riskLevel === "Low" ? "✅ This coin has **low risk** — relatively stable and liquid." : ctx.coin.riskLevel === "Moderate" ? "🟡 This coin has **moderate risk** — some price swings expected." : "🔴 This coin has **high risk** — significant volatility, trade with caution!"}`;
      }
      return `I don't have a specific coin selected right now. Try navigating to a coin's detail page first, then come back and ask about it! Or ask me about **Bitcoin**, **Ethereum**, or any general crypto topic.`;
    },
  },

  // ── Technical terms ──────────────────────────────────────────
  {
    keywords: ["market cap", "mcap", "capitalization"],
    priority: 6,
    response: `## 🏛️ Market Capitalization

**Market Cap** = Current Price × Total Supply of Coins

It tells you the **total value** of a cryptocurrency. It's like the "company size" equivalent in stocks.

- **Large cap** (>$10B) — More stable (BTC, ETH)
- **Mid cap** ($1B–$10B) — Growth potential with some risk
- **Small cap** (<$1B) — High risk, high reward potential

### Why it matters:
A coin priced at $1 isn't "cheap" if there are 100 billion coins! Market cap gives you the true picture.`,
  },

  {
    keywords: ["dca", "dollar cost", "averaging", "regular invest"],
    priority: 6,
    response: `## 📅 Dollar-Cost Averaging (DCA)

**DCA** means investing a **fixed amount** at **regular intervals**, regardless of price.

### Example:
- Invest $100 every week into Bitcoin
- Some weeks you buy at $60K, some at $55K, some at $65K
- Your average price smooths out over time

### Benefits:
- ✅ Removes emotion from investing
- ✅ No need to "time the market"
- ✅ Reduces impact of volatility
- ✅ Great for beginners

### Downsides:
- ❌ May underperform lump-sum in a strong bull market
- ❌ Requires discipline and patience`,
  },

  {
    keywords: ["defi", "decentralized finance"],
    priority: 5,
    response: `## 🏦 DeFi (Decentralized Finance)

**DeFi** removes banks and middlemen from financial services using blockchain and smart contracts.

### Examples:
- **Lending/Borrowing** — Earn interest by lending crypto (Aave, Compound)
- **Decentralized Exchanges** — Trade without a company in the middle (Uniswap)
- **Yield Farming** — Earn rewards by providing liquidity
- **Stablecoins** — Crypto pegged to USD (USDT, USDC)

### Risks:
- Smart contract bugs or exploits
- Impermanent loss in liquidity pools
- Regulatory uncertainty`,
  },

  // ── Greetings ────────────────────────────────────────────────
  {
    keywords: ["hello", "hi", "hey", "good morning", "good evening", "what can you do"],
    priority: 1,
    response: `## 👋 Hello! I'm **CryptoRisk AI Assistant**

I can help you with:

🔹 **Understanding risk scores** — What they mean and how they're calculated
🔹 **Investment guidance** — Which coins are safer for beginners
🔹 **Market trends** — What's happening in the crypto market
🔹 **Terminology** — Explain any crypto term in simple language
🔹 **Platform features** — How to use dashboards, charts, and tools

### Try asking:
- "What does a risk score of 70 mean?"
- "What's the safest crypto for beginners?"
- "Explain volatility vs liquidity"
- "How does sentiment analysis work?"
- "Tell me about this coin"`,
  },

  // ── Thanks ───────────────────────────────────────────────────
  {
    keywords: ["thank", "thanks", "thx", "appreciate"],
    priority: 1,
    response: "You're welcome! 😊 Feel free to ask anything else about crypto risk and investing. I'm here to help!",
  },
];

/** Default response when no keyword matches */
const DEFAULT_RESPONSE = (ctx: ChatContext) => {
  const coinHint = ctx.coin ? `\n\nI can see you're looking at **${ctx.coin.name}** — ask me about its risk, price, or market outlook!` : "";
  return `I'm not sure I understand that question. Here are some things I can help with:

- 📊 **"What is a risk score?"** — Learn about risk analysis
- 🛡️ **"What's safe to invest in?"** — Investment guidance
- 📈 **"What are the market trends?"** — Current market overview
- 📖 **"Explain volatility"** — Crypto terminology
- 🧭 **"How do I use this platform?"** — Feature guide

Try rephrasing or pick one of these topics!${coinHint}`;
};

/**
 * Generate a response to a user message using the local knowledge base.
 * Returns the response as a string (with markdown formatting).
 */
export function generateChatResponse(userMessage: string, context: ChatContext = {}): string {
  const lower = userMessage.toLowerCase().trim();

  // Score each knowledge entry by how many keywords match
  let bestMatch: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        score += kw.length + (entry.priority ?? 5); // Longer keywords + priority = better match
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) {
    return typeof bestMatch.response === "function"
      ? bestMatch.response(context)
      : bestMatch.response;
  }

  // Check if user is asking about a specific coin by name
  if (context.allCoins?.length) {
    const matchedCoin = context.allCoins.find(
      (c) => lower.includes(c.name.toLowerCase()) || lower.includes(c.symbol.toLowerCase())
    );
    if (matchedCoin) {
      const coinContext = { ...context, coin: matchedCoin };
      const coinEntry = KNOWLEDGE_BASE.find((e) => e.keywords.includes("about this coin"));
      if (coinEntry && typeof coinEntry.response === "function") {
        return coinEntry.response(coinContext);
      }
    }
  }

  return typeof DEFAULT_RESPONSE === "function" ? DEFAULT_RESPONSE(context) : DEFAULT_RESPONSE;
}
