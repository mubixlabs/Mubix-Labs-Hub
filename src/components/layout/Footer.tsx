import { NavLink } from "./NavLink";
import { CookiePreferencesButton } from "./CookiePreferencesButton";
import { GithubIcon, LinkedinIcon, XSocialIcon } from "@/components/ui/BrandIcons";
import { siteConfig } from "@/config/site";
import { getActiveProducts } from "@/config/products";

export function Footer() {
  const products = getActiveProducts();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-bold text-foreground">{siteConfig.shortName} Labs</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Developer tools that remove friction from the workflow.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <GithubIcon size={18} />
              </a>
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <XSocialIcon size={18} />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <LinkedinIcon size={18} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Products</p>
            <ul className="mt-3 space-y-2">
              {products.map((p) => (
                <li key={p.slug}>
                  <NavLink prefetch={false}
                    href={`/products/${p.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {p.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Company</p>
            <ul className="mt-3 space-y-2">
              <li>
                <NavLink prefetch={false} href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </NavLink>
              </li>
              <li>
                <NavLink prefetch={false} href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </NavLink>
              </li>
              <li>
                <NavLink prefetch={false} href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Legal</p>
            <ul className="mt-3 space-y-2">
              <li>
                <NavLink prefetch={false} href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink prefetch={false} href="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </NavLink>
              </li>
              <li>
                <NavLink prefetch={false} href="/cookie-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </NavLink>
              </li>
              <li>
                <CookiePreferencesButton />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} {siteConfig.shortName} Labs. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            <a href={`mailto:${siteConfig.contact.support}`} className="hover:text-foreground transition-colors">
              {siteConfig.contact.support}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
