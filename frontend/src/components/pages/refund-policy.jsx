import { Helmet } from "react-helmet";

export default function RefundPolicy() {
  return (
    <>
     <Helmet>
        <title>Return & Refund Policy | Value Cart</title>
        <meta name="description" content="Check our return and refund policies to ensure a smooth experience." />
      </Helmet>
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Refund Policy</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Last updated: {new Date().toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="space-y-6 text-foreground">
        <div className="bg-accent/5 border border-accent/20 p-4 rounded-lg">
          <p className="font-semibold text-accent text-sm">7-Day Return & Refund Guarantee</p>
          <p className="text-sm text-muted-foreground mt-1">
            We stand behind our products. If you're not satisfied, we're here to help within 7 days of delivery.
          </p>
        </div>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">Eligibility for Returns</h2>
          <ul className="list-disc pl-5 text-muted-foreground space-y-2 text-sm leading-relaxed">
            <li>Item must be unused and in original condition</li>
            <li>Item must be in original packaging with all tags attached</li>
            <li>Return request must be made within 7 days of delivery</li>
            <li>Proof of purchase is required (order ID or receipt)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">Non-Returnable Items</h2>
          <ul className="list-disc pl-5 text-muted-foreground space-y-2 text-sm leading-relaxed">
            <li>Items on sale or purchased with a discount code</li>
            <li>Undergarments and swimwear for hygiene reasons</li>
            <li>Damaged items due to misuse</li>
            <li>Items without original packaging</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">Refund Process</h2>
          <ol className="list-decimal pl-5 text-muted-foreground space-y-2 text-sm leading-relaxed">
            <li>Contact us at support@store.pk within 7 days of delivery</li>
            <li>Provide your order ID and reason for return</li>
            <li>Our team will review your request within 24 hours</li>
            <li>Once approved, ship the item back to our address</li>
            <li>Refund is processed within 3-5 business days after receiving the item</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">Refund Methods</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            For COD orders, refunds are processed via bank transfer. Please provide your bank account details when initiating the return. We do not offer cash refunds at this time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">Damaged or Wrong Items</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            If you receive a damaged or incorrect item, please contact us immediately with photos. We will arrange a free pickup and send a replacement or full refund at no additional cost.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">Contact</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            For return requests or refund inquiries, contact us at <strong>support@store.pk</strong> or call <strong>+92 300 1234567</strong>.
          </p>
        </section>
      </div>
    </div>
    </>
  );
}