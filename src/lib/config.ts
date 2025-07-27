import contentConfig from "~/config/content.json";
import brandingConfig from "~/config/branding.json";

// Type definitions for content configuration
export interface ContentPart {
  text: string;
  italic?: boolean;
  bold?: boolean;
  color?: "primary" | "secondary" | "blue" | "destructive";
}

export interface HeadlineConfig {
  parts: ContentPart[];
}

export interface NavLink {
  label: string;
  href: string;
  dropdownItems?: {
    title: string;
    href: string;
    description: string;
  }[];
}

export interface ContentConfig {
  meta: {
    voice: {
      tone: string;
      style: string;
      perspective: string;
      personality: string;
    };
    purpose: string;
    goals: string[];
    target_audience: string;
  };
  brand: {
    name: string;
    logo: string;
    tagline: string;
  };
  navbar: {
    links: NavLink[];
    cta: {
      primary: { text: string; href: string };
      secondary: { text: string; href: string };
    };
  };
  hero: {
    headline: HeadlineConfig;
    subheadline: string;
    testimonials: Array<{
      id: number;
      image: string;
      name: string;
    }>;
  };
  problemSolution: {
    problem: {
      pill: string;
      headline: HeadlineConfig;
      subheadline: string;
      cards: Array<{
        icon: string;
        title: string;
        description: string;
      }>;
      longForm: {
        title: string;
        intro: string;
        quote: {
          text: string;
          author: string;
        };
        breakdown: {
          title: string;
          items: Array<{
            title: string;
            duration: string;
            description: string;
          }>;
        };
        conclusion: {
          title: string;
          text: string;
          cta: string;
        };
      };
    };
    solution: {
      pill: string;
      headline: HeadlineConfig;
      subheadline: string;
      cards: Array<{
        icon: string;
        title: string;
        description: string;
        color: string;
        colSpan?: number;
      }>;
    };
  };
  features: {
    pill: string;
    headline: HeadlineConfig;
    subheadline: string;
    items: Array<{
      title: string;
      category: string;
      description: string;
      icon: string;
      color: string;
    }>;
  };
  socialProof: {
    stats: {
      headline: HeadlineConfig;
      items: Array<{
        icon: string;
        value: string;
        label: string;
        description: string;
      }>;
    };
    testimonials: {
      pill: string;
      headline: HeadlineConfig;
      subheadline: string;
      items: Array<{
        content: string;
        author: {
          name: string;
          role: string;
          company: string;
          image: string;
        };
        rating: number;
      }>;
    };
    logos: {
      title: string;
      items: Array<{
        name: string;
        url: string;
        showName: boolean;
        className?: string;
      }>;
    };
  };
  pricing: {
    pill: string;
    headline: HeadlineConfig;
    subheadline: string;
    plans: Array<{
      name: string;
      price: string;
      description: string;
      features: string[];
      highlighted?: boolean;
    }>;
  };
  faq: {
    pill: string;
    headline: HeadlineConfig;
    subheadline?: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  footer: {
    company: {
      name: string;
      description: string;
      logo: string;
    };
    links: Array<{
      title: string;
      items: Array<{
        label: string;
        href: string;
      }>;
    }>;
    social: Array<{
      name: string;
      href: string;
      icon: string;
    }>;
  };
  finalCta: {
    badge: string;
    headline: HeadlineConfig;
    description: string;
    primaryButton: {
      text: string;
      href: string;
    };
    secondaryButton: {
      text: string;
      href: string;
    };
  };
}

// Type definitions for branding configuration
export interface ColorConfig {
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  tailwind: Record<string, string> | string;
}

export interface BrandingConfig {
  colors: {
    primary: ColorConfig;
    secondary: ColorConfig;
    accent: ColorConfig;
    destructive: ColorConfig;
  };
  fonts: {
    sans: {
      name: string;
      import: string;
      family: string;
    };
    serif: {
      name: string;
      import: string;
      family: string;
      usage: string;
    };
  };
  radius: Record<string, string>;
  shadows: Record<string, string>;
}

// Export typed configurations
export const content = contentConfig as unknown as ContentConfig;
export const branding = brandingConfig as unknown as BrandingConfig;

// Helper function to get color classes for headline parts
export function getHeadlineColorClass(color?: string) {
  switch (color) {
    case "primary":
      return "text-[#f97316]";
    case "blue":
      return "text-[#1e40af]";
    case "destructive":
      return "text-red-500";
    default:
      return "";
  }
}

// Helper to get color value
export function getColor(colorName: keyof BrandingConfig["colors"]) {
  return branding.colors[colorName];
}

// Helper to replace template variables
export function interpolate(text: string, variables: Record<string, string>) {
  return text.replace(/{(\w+)}/g, (match, key: string) => variables[key] ?? match);
}