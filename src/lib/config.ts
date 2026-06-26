import fs from 'node:fs';
import YAML from 'yaml';
import path from 'node:path';

const configPath = path.resolve('./site.config.yaml');
const raw = fs.readFileSync(configPath, 'utf8');
const config = YAML.parse(raw);

export interface PricingTier {
  name: string;
  price: number | string;
  price_label?: string;
  period?: string;
  description?: string;
  features?: string[];
  featured?: boolean;
  cta?: string;
}

export interface ServicePricing {
  setup_fee?: number;
  quote_based?: boolean;
  headline?: string;
  note?: string;
  description?: string;
  tiers?: PricingTier[];
}

export interface SubService {
  slug: string;
  name: string;
  short_description?: string;
}

export interface Service {
  slug: string;
  name: string;
  nav_name?: string;
  short_description: string;
  tagline?: string;
  price_summary?: string;
  group?: string;
  icon?: string;
  image?: string;
  keywords?: string[];
  pricing?: ServicePricing;
  sub_services?: SubService[];
}

export interface Review {
  author: string;
  company?: string;
  text: string;
  rating: number;
  date?: string;
}

export interface CaseStudy {
  slug?: string;
  title: string;
  category: string;
  industry?: string;
  location?: string;
  result: string;
  metrics?: {
    primary: string;
    secondary?: string;
  };
  blurb?: string;
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface SiteConfig {
  business: {
    name: string;
    spoken_name?: string;
    legal_name: string;
    endorsement?: string;
    owner: string;
    phone: string;
    phone_raw: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      state_full: string;
      zip: string;
    };
    address_note?: string;
    hours: string;
    tagline: string;
    description: string;
    google_maps_url: string;
    founded_year: number;
    geo?: {
      latitude: number;
      longitude: number;
    };
    hours_schema?: string;
    team?: TeamMember[];
    market?: string;
  };
  brand: {
    theme: string;
    colors: {
      primary: string;
      primary_rgb?: string;
      secondary: string;
      accent?: string;
      dark: string;
      light: string;
      white: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    logo: string;
  };
  trust_signals: {
    rating: string;
    review_count: number;
    review_platform: string;
    badges: string[];
  };
  exclusivity?: {
    note?: string;
    claimed: string[];
  };
  service_groups?: { slug: string; name: string; blurb?: string }[];
  services: Service[];
  reviews: Review[];
  case_studies: CaseStudy[];
  form: {
    action: string;
  };
  seo: {
    domain: string;
    title_suffix: string;
  };
  built_by: {
    name: string;
    url: string;
    logo?: string;
    logo_white?: string;
  };
}

/** Public URL path for a service page, e.g. "seo" -> "/seo-topeka/" */
export function servicePath(slug: string): string {
  return `/${slug}-topeka/`;
}

export default config as SiteConfig;
