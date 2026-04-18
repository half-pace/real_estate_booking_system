import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Contact() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-900 dark:text-white mb-6">Contact Us</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem. Aliquam erat volutpat. Donec placerat nisl magna.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-neutral-800 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-sm">
            <h2 className="text-2xl font-heading font-bold text-primary-900 dark:text-white mb-6">Send us a Message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-accent-500/50 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-accent-500/50 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Message</label>
                <textarea 
                  rows="4"
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-primary-900 dark:text-white focus:ring-2 focus:ring-accent-500/50 outline-none transition-colors"
                ></textarea>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl text-lg">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8 flex flex-col justify-center">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-primary-900 dark:text-white mb-2">Office Location</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  123 Luxury Lane, Suite 100<br />
                  New York, NY 10001
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-primary-900 dark:text-white mb-2">Phone Number</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-1">+1 (555) 123-4567</p>
                <p className="text-neutral-600 dark:text-neutral-400">+1 (555) 987-6543</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-primary-900 dark:text-white mb-2">Email Address</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-1">hello@cit-es.com</p>
                <p className="text-neutral-600 dark:text-neutral-400">support@cit-es.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
