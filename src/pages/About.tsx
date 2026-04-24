import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Headphones, Zap, Globe, ArrowRight } from "lucide-react";
import lifestyleMusic from "@/assets/lifestyle-music.jpg";

const About = () => (
  <div>
    <section className="container py-16 sm:py-24">
      <div className="max-w-3xl space-y-6">
        <p className="text-sm font-semibold text-gradient uppercase tracking-widest">Our Story</p>
        <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05]">
          Built for people who <span className="text-gradient">move.</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          PowerPod is for your soundtrack, your charge, your moment. We're here to keep you connected and entertained through it all.
        </p>
      </div>
    </section>

    <section className="container">
      <div className="relative rounded-3xl overflow-hidden border border-border/50">
        <img src={lifestyleMusic} alt="PowerPod lifestyle" loading="lazy" width={1280} height={960} className="w-full h-[420px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>
    </section>

    <section className="container py-20">
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: Zap, title: "Power", text: "Energy that follows you everywhere." },
          { icon: Headphones, title: "Sound", text: "Music and calls, always clear." },
          { icon: Globe, title: "Local", text: "Made for Malawi, made for you." },
        ].map((v) => (
          <div key={v.title} className="rounded-3xl p-8 bg-card border border-border/60 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-brand flex items-center justify-center">
              <v.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-display font-bold text-2xl">{v.title}</h3>
            <p className="text-muted-foreground">{v.text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="container py-12">
      <div className="rounded-3xl p-10 sm:p-16 bg-gradient-brand text-white text-center space-y-5">
        <h2 className="font-display font-bold text-3xl sm:text-5xl">This is PowerPod.</h2>
        <p className="text-white/85 max-w-xl mx-auto">Keep the vibe alive. Order through WhatsApp.</p>
        <Button asChild size="xl" className="bg-background text-foreground hover:bg-background/90">
          <Link to="/shop">Shop Now <ArrowRight className="h-5 w-5" /></Link>
        </Button>
      </div>
    </section>
  </div>
);

export default About;