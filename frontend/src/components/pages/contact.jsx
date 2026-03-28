import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Input } from "../ui/input.jsx";
import { Button } from "../ui/button.jsx";
import { toast } from "../hooks/use-toast.js";
import { Helmet } from "react-helmet-async";

// Zod validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  message: z.string().min(5, "Message is required"),
});

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data) => {
    // Simulate API submission
    setSubmitted(true);
    toast({ title: "Message Sent!", description: "We'll get back to you soon." });

    setTimeout(() => setSubmitted(false), 4000);
    reset();
    console.log("Form Data:", data);
  };

  return (
    <>
     <Helmet>
        <title>Contact Us | Value Cart</title>
        <meta name="description" content="Get in touch with My Store. We are here to help you with your queries and support." />
        <meta property="og:title" content="Contact Us | My Store" />
        <meta property="og:description" content="Reach out to us for any assistance or support." />
        <meta property="og:image" content="/default-contact.jpg" />
      </Helmet>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-display font-bold mb-3">Contact Us</h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
          We're here to help. Reach out and our team will get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-display font-bold">Get in Touch</h2>
          <div className="space-y-5">
            {[
              { icon: MapPin, title: "Our Address", value: "123 Fashion Avenue, Block 7\nKarachi, Pakistan" },
              { icon: Phone, title: "Phone Number", value: "+92 300 1234567\n+92 21 12345678" },
              { icon: Mail, title: "Email Address", value: "support@store.pk\norders@store.pk" },
              { icon: Clock, title: "Working Hours", value: "Mon – Sat: 9:00 AM – 8:00 PM\nSunday: 11:00 AM – 5:00 PM" },
            ].map(({ icon: Icon, title, value }) => (
              <div key={title} className="flex gap-4 p-4 bg-secondary/50 border border-border">
                <div className="w-10 h-10 bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-0.5">{title}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-border p-6 md:p-8">
          <h2 className="text-xl font-display font-bold mb-6">Send a Message</h2>

          {submitted ? (
            <div className="bg-accent/10 border border-accent/20 p-6 text-center">
              <div className="text-3xl mb-2">✓</div>
              <p className="font-semibold text-accent">Message sent!</p>
              <p className="text-sm text-muted-foreground mt-1">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">Full Name</label>
                <Input
                  placeholder="John Doe"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-destructive text-[11px] mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium block mb-1.5">Email Address</label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-destructive text-[11px] mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium block mb-1.5">Phone Number</label>
                <Input placeholder="+92 300 1234567" {...register("phone")} />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1.5">Message</label>
                <textarea
                  placeholder="How can we help you?"
                  rows={4}
                  {...register("message")}
                  className={`w-full border border-input px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none ${
                    errors.message ? "border-destructive" : ""
                  }`}
                />
                {errors.message && <p className="text-destructive text-[11px] mt-1">{errors.message.message}</p>}
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
    </>
  );
}