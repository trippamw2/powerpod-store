import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatMWK, kits } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { Truck, MessageCircle, ShieldCheck, Heart, BookOpen, Briefcase, Headphones, Luggage, ArrowRight, CheckCircle, Zap, Loader2 } from "lucide-react";
import hero from "@/assets/hero-lifestyle.jpg";

const Home = () => {
  const { loading } = useProducts();
  const { add } = useCart();

  return (
    <div>
      {/* FLASH SALE BAR */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 text-center text-xs sm:text-sm font-medium">
        <span className="inline-flex items-center gap-2">
          Free delivery over MK 50,000 • 30 day guarantee • Limited stock selling fast
        </span>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="container relative grid lg:grid-cols-2 gap-6 sm:gap-8 items-center py-8 sm:py-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-5 sm:space-y-6"
          >
            <span className="inline-flex px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold tracking-wide">
              Tech Kits for Malawi
            </span>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-6xl leading-tight">
              Your Phone Dies at the Worst Moment.
              <br />
              <span className="text-gradient">We Fixed That.</span>
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-lg">
              Dead battery before an important call? Earbuds dying on the bus? Charger cable that 
              gave up after a week? We put together the exact charger, cable and power bank you need.
              All tested. All reliable. One box, delivered to your door.
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-medium border border-orange-200">
              <span className="font-semibold">The PowerPod System.</span> Tested kits. 30 day guarantee. Free delivery over MK 50,000.
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="hero" size="lg" className="text-sm sm:text-base">
                <Link to="/combos">Shop Tech Kits <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-sm sm:text-base border-gray-300">
                <Link to="/shop">Individual Items</Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              30 day guarantee. Not happy? Send it back. No questions asked.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-brand opacity-20 blur-3xl rounded-full" />
            <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-xl">
              <img src={hero} alt="PowerPod tech lifestyle" className="w-full aspect-[4/5] sm:aspect-[3/4] object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="container py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: "Free Delivery", sub: "Over MK 50,000" },
            { icon: MessageCircle, title: "WhatsApp Order", sub: "Quick & easy" },
            { icon: ShieldCheck, title: "6-Month Warranty", sub: "On all kits" },
            { icon: Heart, title: "2,500+ Happy", sub: "Customers in Malawi" },
          ].map((v) => (
            <div key={v.title} className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-lg bg-gradient-brand flex items-center justify-center shrink-0">
                <v.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">{v.title}</p>
                <p className="text-xs text-muted-foreground">{v.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP BY LIFESTYLE */}
      <section className="container py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-sm font-semibold text-gradient uppercase tracking-widest">Choose Your Lifestyle</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl mt-1">Shop by Lifestyle</h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">Not just products. A complete experience built for how you live.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: BookOpen, title: "Student Essentials Kit", tag: "student", desc: "Power your studies. Stay charged all day.", color: "from-blue-500 to-cyan-500" },
            { icon: Briefcase, title: "Work & Office Kit", tag: "work", desc: "Professional setup. Productivity meets power.", color: "from-purple-500 to-indigo-500" },
            { icon: Luggage, title: "Travel Power Kit", tag: "travel", desc: "Never run low. Adventure ready.", color: "from-green-500 to-teal-500" },
            { icon: Headphones, title: "Audio Lifestyle Kit", tag: "audio", desc: "Your soundtrack. Anywhere.", color: "from-orange-500 to-red-500" },
          ].map((item, i) => (
            <motion.div
              key={item.tag}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-xl sm:rounded-2xl p-5 sm:p-6 bg-white border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-200"
            >
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-display font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
              <Link to="/combos" className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                View Kit <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY OUR KITS */}
      <section className="bg-gradient-to-b from-orange-50/50 to-white py-12 sm:py-16">
        <div className="container">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-sm font-semibold text-gradient uppercase tracking-widest">Why PowerPod Kits</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl mt-1">Smarter Than Buying Separate</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: CheckCircle, title: "No Guesswork", desc: "We picked the right parts for your life. No research needed." },
              { icon: Zap, title: "Save 15-30%", desc: "Kits cost less than buying everything separate. Better deal." },
              { icon: Heart, title: "30-Day Guarantee", desc: "Not happy? Send it back. No questions asked. That's how sure we are." },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="h-14 w-14 rounded-full bg-gradient-brand flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED KITS */}
      <section className="container py-12 sm:py-16">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <p className="text-sm font-semibold text-gradient uppercase tracking-widest">Featured Kits</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl">Top Picks</h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/combos">View All <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {loading ? (
            <div className="col-span-3 flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            kits.slice(0, 3).map((kit, i) => (
              <motion.div
                key={kit.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-xl sm:rounded-2xl bg-white border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                {kit.badge && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-orange-500 text-white text-[10px] font-semibold uppercase tracking-wider z-10">
                    {kit.badge}
                  </span>
                )}
                {kit.stock !== undefined && kit.stock <= 5 && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full border border-orange-300 bg-white text-orange-600 text-[10px] font-medium z-10">
                    Only {kit.stock} left
                  </span>
                )}
                <div className="p-5 sm:p-6">
                  <h3 className="font-display font-bold text-xl text-gray-900">{kit.name}</h3>
                  <p className="text-sm font-medium text-orange-600 mt-1">{kit.hook}</p>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{kit.description}</p>

                  <ul className="mt-4 space-y-1.5">
                    {kit.items.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                    {kit.items.length > 3 && (
                      <li className="text-xs text-gray-400">+{kit.items.length - 3} more items</li>
                    )}
                  </ul>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="font-bold text-lg text-gray-900">{formatMWK(kit.price)}</p>
                      <p className="text-xs text-green-600 font-medium">Save {formatMWK(kit.saving)}</p>
                    </div>
                    <Button
                      onClick={() => add({ productKey: kit.id, name: kit.name, price: kit.price, image: kit.image }, 1)}
                      variant="hero"
                      size="sm"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* THE POWERPOD METHOD (How It Works) */}
      <section className="bg-gradient-to-b from-white to-orange-50/50 py-12 sm:py-16">
        <div className="container">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-sm font-semibold text-gradient uppercase tracking-widest">The PowerPod Method</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl mt-1">Three Steps to Never Running Out</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-12 max-w-3xl mx-auto">
            {[
              { step: "01", title: "Pick Your Kit", desc: "Choose the kit that fits your life. Student, work, travel or audio." },
              { step: "02", title: "Order", desc: "Checkout online or order in 30 seconds on WhatsApp." },
              { step: "03", title: "Delivered & Guaranteed", desc: "Fast delivery across Malawi. Love it or send it back within 30 days." },
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="h-16 w-16 rounded-full bg-gradient-brand flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="font-display font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container pb-12 sm:pb-16">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 p-8 sm:p-12 md:p-16 text-center text-white">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-white/5" />
          
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl relative">Love Your Kit or Send It Back</h2>
          <p className="text-white/80 text-sm sm:text-base mt-2 max-w-lg mx-auto relative">
            30 day guarantee. No questions asked. Join over 2,500 customers in Malawi who've upgraded.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 relative">
            <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90">
              <Link to="/combos">Get Your Kit Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/shop">Shop Individual Items</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;