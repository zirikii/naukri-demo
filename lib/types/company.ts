export type CompanyType = "MNC" | "Indian MNC" | "Startup" | "Unicorn" | "Government" | "Product";

export interface Company {
  id: string;
  name: string;
  slug: string;
  /** Average rating out of 5. */
  rating: number;
  reviewsCount: number;
  industry: string;
  type: CompanyType;
  /** HSL hue used to render a colored initials avatar when no real logo is present. */
  logoHue: number;
  /** Short tagline shown on the company logo bar. */
  tagline: string;
  /** Markdown blurb used on the JD "About company" section. */
  about: string;
}
