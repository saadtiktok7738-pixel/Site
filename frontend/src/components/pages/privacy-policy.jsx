import { Helmet } from "react-helmet";

export default function PrivacyPolicy() {
  return (
    <>
    <Helmet>
        <title>Privacy Policy | Value Cart</title>
        <meta name="description" content="Learn how we collect, use, and protect your personal information." />
      </Helmet>
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Privacy Policy</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Last updated: {new Date().toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="prose prose-sm max-w-none space-y-6 text-foreground">
        <section>
          <h2 className="text-xl font-display font-bold mb-3">1. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            We collect information you provide directly to us, such as your name, email address, phone number, and shipping address when you place an order, create an account, or contact us. We also collect information about your orders and purchase history.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">2. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-2">We use the information we collect to:</p>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1 text-sm">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and updates</li>
            <li>Respond to your comments and questions</li>
            <li>Improve our products and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">3. Information Sharing</h2>
          <p className="text-muted-foreground leading-relaxed">
            We do not sell, trade, or rent your personal information to third parties. We may share your information with delivery partners solely for the purpose of fulfilling your orders.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">4. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no internet transmission is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">5. Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use cookies and similar tracking technologies to track activity on our website and hold certain information to improve your browsing experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">6. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed">
            You have the right to access, update, or delete your personal information. To exercise these rights, please contact us at support@store.pk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">7. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at support@store.pk or call +92 300 1234567.
          </p>
        </section>
      </div>
    </div>
    </>
  );
}