import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "product";
}

const SITE_NAME = "PowerPod";
const SITE_URL = "https://powerpod.mw";
const DEFAULT_DESC = "Phone accessories and tech kits in Malawi. Power banks, earbuds, headphones, speakers, and car chargers. Free delivery over MK 50,000.";
const DEFAULT_IMAGE = "https://oalemobile.com/wp-content/uploads/2026/02/Nano2%E9%BB%91%E8%89%B2.png";

export const SEO = ({
  title,
  description,
  path = "",
  image = DEFAULT_IMAGE,
  type = "website",
}: SEOProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === "product" ? "Product" : "WebSite",
          name: title,
          description,
          url,
          ...(type === "product" ? { image } : {}),
        })}
      </script>
    </Helmet>
  );
};

export const defaultSEO = {
  home: {
    title: "PowerPod — Phone Accessories & Tech Kits in Malawi",
    description: DEFAULT_DESC,
  },
  shop: {
    title: "Shop — Power Banks, Earbuds, Headphones & More",
    description: "Browse power banks, earbuds, headphones, speakers, car chargers and more. Fast delivery across Malawi.",
  },
  combos: {
    title: "Tech Kits — Save 15-25% vs Buying Separate",
    description: "Curated tech kits for every lifestyle. Power bank + earbuds + charger in one box. Cheaper together. Free delivery.",
  },
  about: {
    title: "About PowerPod — Malawi's Phone Accessories Brand",
    description: "PowerPod keeps you charged and connected. We pick the right gear for your phone. Based in Blantyre, Malawi.",
  },
  contact: {
    title: "Contact PowerPod — WhatsApp, Phone & Email",
    description: "Reach us on WhatsApp, phone or email. Fast replies, fast delivery across Malawi.",
  },
  auth: {
    title: "Sign In or Create Account — PowerPod Rewards",
    description: "Sign in to checkout, track orders, and earn rewards on every purchase.",
  },
  checkout: {
    title: "Checkout — PowerPod Malawi",
    description: "Complete your order. Secure checkout with Airtel Money, TNM Mpamba, and bank transfer.",
  },
  orders: {
    title: "My Orders — PowerPod",
    description: "Track your PowerPod orders and deliveries.",
  },
  rewards: {
    title: "PowerPod Rewards — Earn Points & Redeem Discounts",
    description: "Earn points on every purchase. Redeem for discounts. Refer friends and earn more.",
  },
  compare: {
    title: "Compare Products — PowerPod",
    description: "Compare phone accessories side by side. Find the best gear for your needs.",
  },
  faq: {
    title: "FAQ — PowerPod Malawi",
    description: "Frequently asked questions about ordering, delivery, warranty, and returns.",
  },
  terms: {
    title: "Terms & Conditions — PowerPod",
    description: "Terms and conditions for PowerPod online store.",
  },
  privacy: {
    title: "Privacy Policy — PowerPod",
    description: "How PowerPod collects, uses, and protects your personal information.",
  },
  returns: {
    title: "Returns & Refunds — PowerPod",
    description: "30-day return policy. Not happy? Send it back. No questions asked.",
  },
  warranty: {
    title: "Warranty Information — PowerPod",
    description: "6-month warranty on all electronics. We replace faulty products.",
  },
};
