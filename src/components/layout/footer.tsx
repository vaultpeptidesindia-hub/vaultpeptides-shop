import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image src="/logo.png" alt="Vault Peptides" width={148} height={52} className="object-contain h-10 w-auto" />
            </Link>
            <p className="font-sans text-sm text-muted-foreground max-w-xs leading-relaxed mb-4">
              Premium lab-tested research peptides. Strictly for scientific and research purposes only.
            </p>
            <p className="font-sans text-xs text-muted-foreground/60 italic">
              Not for human consumption.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/60 mb-5">Shop</h4>
            <ul className="space-y-3 font-sans text-sm text-muted-foreground">
              <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=peptides" className="hover:text-primary transition-colors">Peptides</Link></li>
              <li><Link href="/shop?category=blends" className="hover:text-primary transition-colors">Blends</Link></li>
              <li><Link href="/wholesale" className="hover:text-primary transition-colors">Wholesale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/60 mb-5">Learn</h4>
            <ul className="space-y-3 font-sans text-sm text-muted-foreground">
              <li><Link href="/why-vault" className="hover:text-primary transition-colors">Why Vault</Link></li>
              <li><Link href="/purity" className="hover:text-primary transition-colors">Purity Standards</Link></li>
              <li><Link href="/research" className="hover:text-primary transition-colors">Research Hub</Link></li>
              <li><Link href="/verify-batch" className="hover:text-primary transition-colors">Verify Batch</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/60 mb-5">Support</h4>
            <ul className="space-y-3 font-sans text-sm text-muted-foreground">
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-muted-foreground">© 2025 Vault Peptides. All rights reserved.</p>
          <p className="font-sans text-xs text-muted-foreground/60 italic">For laboratory research use only.</p>
        </div>
      </div>
    </footer>
  );
}
