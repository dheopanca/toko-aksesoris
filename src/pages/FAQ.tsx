
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const FAQPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h1>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="order">
            <AccordionTrigger className="text-lg font-semibold">
              How do I place an order?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              <p>
                Placing an order with Permata Indah is simple. Browse our collection, select the items you wish to purchase, and add them to your cart. Once you're ready to checkout, follow these steps:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Review the items in your cart</li>
                <li>Click "Proceed to Checkout"</li>
                <li>If you're not logged in, you'll be prompted to log in or create an account</li>
                <li>Enter your shipping address</li>
                <li>Review your order one more time and click "Complete Order"</li>
              </ol>
              <p className="mt-2">
                After placing your order, you will receive an order confirmation email with all the details of your purchase.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="shipping">
            <AccordionTrigger className="text-lg font-semibold">
              What are your shipping policies?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              <p>
                We offer free standard shipping on all domestic orders over Rp 1,000,000. For orders below this amount, a flat rate of Rp 50,000 applies. Standard shipping typically takes 3-5 business days.
              </p>
              <p className="mt-2">
                Express shipping options are available at checkout for an additional fee. Express shipping typically takes 1-2 business days.
              </p>
              <p className="mt-2">
                International shipping is available to select countries. Rates and delivery times vary depending on the destination.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="returns">
            <AccordionTrigger className="text-lg font-semibold">
              What is your return policy?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              <p>
                We want you to be completely satisfied with your purchase. If for any reason you're not happy with your jewelry, you may return it within 30 days of delivery for a full refund or exchange.
              </p>
              <p className="mt-2">
                To be eligible for a return, the item must be unused, in the same condition that you received it, and in the original packaging with all tags attached.
              </p>
              <p className="mt-2">
                Please note that custom or personalized items cannot be returned unless they are defective or damaged upon arrival.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="warranty">
            <AccordionTrigger className="text-lg font-semibold">
              Does your jewelry come with a warranty?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              <p>
                Yes, all Permata Indah jewelry comes with a 1-year warranty against manufacturing defects. This warranty covers issues such as stone loosening, clasps breaking, or plating wearing off prematurely under normal wear.
              </p>
              <p className="mt-2">
                The warranty does not cover damage caused by accidents, improper care, or normal wear and tear.
              </p>
              <p className="mt-2">
                To make a warranty claim, please contact our customer service team with your order number and a description of the issue.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="materials">
            <AccordionTrigger className="text-lg font-semibold">
              What materials do you use in your jewelry?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              <p>
                At Permata Indah, we use only high-quality materials in our jewelry:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Our gold jewelry is available in 14k and 18k gold.</li>
                <li>Silver pieces are crafted from 925 sterling silver.</li>
                <li>Gemstones are ethically sourced and of high quality.</li>
                <li>Diamonds are conflict-free and come with certification.</li>
              </ul>
              <p className="mt-2">
                All our materials meet international standards for quality and are nickel-free to minimize allergic reactions.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="care">
            <AccordionTrigger className="text-lg font-semibold">
              How should I care for my jewelry?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              <p>
                To keep your Permata Indah jewelry looking its best, follow these care instructions:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Store each piece separately to prevent scratching.</li>
                <li>Remove jewelry before showering, swimming, or exercising.</li>
                <li>Avoid contact with perfumes, lotions, and other chemicals.</li>
                <li>Clean gold and silver jewelry with a soft cloth and mild soap if needed.</li>
                <li>Have gemstone jewelry professionally cleaned once a year.</li>
              </ul>
              <p className="mt-2">
                We recommend storing your jewelry in the original box or a fabric-lined jewelry box when not in use.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="size">
            <AccordionTrigger className="text-lg font-semibold">
              How do I determine my ring size?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              <p>
                The most accurate way to determine your ring size is to visit a local jeweler for a professional measurement. However, you can also measure at home using these methods:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Use a ring that already fits well and measure its inner diameter.</li>
                <li>Wrap a piece of string or paper around your finger, mark where it overlaps, and measure the length.</li>
              </ol>
              <p className="mt-2">
                For best results, measure your finger at the end of the day when it's at its largest, and take multiple measurements on different days.
              </p>
              <p className="mt-2">
                You can refer to our size guide for a conversion chart between different measurement systems.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="customization">
            <AccordionTrigger className="text-lg font-semibold">
              Do you offer custom jewelry?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              <p>
                Yes, we offer customization services for select pieces in our collection. Options include:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Engraving (names, dates, or short messages)</li>
                <li>Choice of metal (yellow gold, white gold, rose gold, or platinum)</li>
                <li>Stone selection for certain designs</li>
                <li>Size adjustments beyond our standard range</li>
              </ul>
              <p className="mt-2">
                For fully custom designs, please contact our customer service team to discuss your requirements and get a quote. Custom orders typically take 4-6 weeks to complete.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="payment">
            <AccordionTrigger className="text-lg font-semibold">
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              <p>
                Currently, we only accept cash payments. When placing an online order, your payment will be collected when your order is delivered to you (cash on delivery).
              </p>
              <p className="mt-2">
                All prices on our website are listed in Indonesian Rupiah (IDR).
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="contact">
            <AccordionTrigger className="text-lg font-semibold">
              How can I contact customer service?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              <p>
                Our customer service team is available to assist you in the following ways:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Email: info@permataindah.com (responses within 24 hours)</li>
                <li>Phone: +62 123 456 7890 (Monday to Friday, 9 AM to 5 PM WIB)</li>
                <li>Live Chat: Available on our website during business hours</li>
                <li>Contact Form: Available on our Contact Us page</li>
              </ul>
              <p className="mt-2">
                For order-specific inquiries, please have your order number ready.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="mt-12 bg-gray-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">
            Our customer service team is ready to help you with any other questions you may have.
          </p>
          <Button className="px-6">Contact Us</Button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
