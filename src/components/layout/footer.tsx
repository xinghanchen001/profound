export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Profound</h3>
            <p className="text-sm text-muted-foreground">
              Answer Engine Optimization Platform for AI-powered search visibility.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/features" className="hover:text-foreground">Features</a></li>
              <li><a href="/pricing" className="hover:text-foreground">Pricing</a></li>
              <li><a href="/documentation" className="hover:text-foreground">Documentation</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-foreground">About</a></li>
              <li><a href="/contact" className="hover:text-foreground">Contact</a></li>
              <li><a href="/careers" className="hover:text-foreground">Careers</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/privacy" className="hover:text-foreground">Privacy</a></li>
              <li><a href="/terms" className="hover:text-foreground">Terms</a></li>
              <li><a href="/security" className="hover:text-foreground">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Profound. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}