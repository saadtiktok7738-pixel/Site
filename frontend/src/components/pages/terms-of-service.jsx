import { Helmet } from "react-helmet";

export default function TermsOfService() {
  return (
    <>
    <Helmet>
        <title>Terms of Service | My Store</title>
        <meta name="description" content="Read the terms and conditions for using our website and services." />
      </Helmet>
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Terms of Service</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Last updated: {new Date().toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="space-y-6 text-foreground">
        <section>
          <h2 className="text-xl font-display font-bold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            By accessing and using this website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">2. Use of the Website</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">
            You agree to use this website only for lawful purposes and in a way that does not infringe the rights of others. You must not:
          </p>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1 text-sm">
            <li>Use the site in any way that violates applicable laws or regulations</li>
            <li>Transmit unsolicited commercial communications</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Engage in fraudulent activities</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">3. Products and Pricing</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            All prices are displayed in Pakistani Rupees (PKR). We reserve the right to change prices at any time. Product availability is subject to change without notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">4. Orders and Payment</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            When you place an order, you represent that all information provided is accurate and complete. We currently accept Cash on Delivery (COD) only. We reserve the right to cancel any order for any reason.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">5. Shipping and Delivery</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We deliver across Pakistan. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by courier services or circumstances beyond our control.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">6. Intellectual Property</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            All content on this website, including images, logos, and text, is the property of STORE and protected by applicable intellectual property laws. You may not reproduce or distribute our content without written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">7. Limitation of Liability</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or our products.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">8. Governing Law</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            These Terms of Service are governed by the laws of Pakistan. Any disputes shall be subject to the jurisdiction of courts in Karachi, Pakistan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">9. Changes to Terms</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">10. Contact</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            For questions regarding these Terms of Service, contact us at support@store.pk.
          </p>
        </section>
      </div>
    </div>
    </>
  );
}