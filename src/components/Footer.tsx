
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'xmrtsolutions@gmail.com') {
      toast({
        title: "Subscription successful",
        description: "You've been subscribed to our updates!",
      });
      setEmail('');
    } else {
      toast({
        title: "Subscription failed",
        description: "Please use xmrtsolutions@gmail.com to subscribe",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="bg-[#9b87f5] text-white py-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Travel XMRT</h3>
            <p className="text-sm opacity-80">
              Your AI-powered travel companion for seamless navigation and translation.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="xmrtsolutions@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-[#1A1F2C]"
              />
              <Button type="submit" variant="secondary">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-center text-sm opacity-60">
            © {new Date().getFullYear()} Travel XMRT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
