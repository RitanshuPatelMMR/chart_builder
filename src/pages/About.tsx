import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Github, Linkedin, BarChart3, Upload, Table, Palette, Download, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Upload,
    title: "Upload Excel or CSV",
    description: "Import your data files with a simple drag-and-drop interface.",
  },
  {
    icon: Table,
    title: "Edit Data In-Browser",
    description: "Modify your data directly in an intuitive table editor.",
  },
  {
    icon: BarChart3,
    title: "Multiple Chart Types",
    description: "Choose from bar, line, pie, area, and more visualization options.",
  },
  {
    icon: Palette,
    title: "Full Customization",
    description: "Customize colors, axes, labels, and layout to match your brand.",
  },
  {
    icon: Download,
    title: "Easy Export",
    description: "Download your charts as PNG or PDF with one click.",
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "See your charts render in real-time as you customize.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              About Chartify
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Chartify is a web-based data visualization tool that helps users turn raw Excel or CSV data into clean, customizable charts in minutes.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 border-t border-border">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">
              Our Mission
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Creating charts in traditional spreadsheet software is time-consuming and inflexible. You're often limited by rigid templates, clunky interfaces, and outputs that don't quite match your vision.
              </p>
              <p>
                Chartify solves this by providing a fast, browser-based chart generation experience with full customization control. No software installation, no steep learning curve—just upload your data, customize your visualization, and export.
              </p>
              <p>
                We believe data visualization should be <strong className="text-foreground">simple</strong>, <strong className="text-foreground">fast</strong>, and <strong className="text-foreground">accessible</strong> to everyone, regardless of technical expertise.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 border-t border-border bg-muted/30">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight mb-10">
              What Chartify Offers
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-16 border-t border-border">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight mb-8">
              Built By
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl font-semibold text-muted-foreground shrink-0">
                JD
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">John Doe</h3>
                  <p className="text-sm text-muted-foreground">Founder & Developer</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Chartify is built and maintained by a full-stack developer with a focus on modern web technologies, clean UI, and scalable system design. With a passion for developer tools and data visualization, this project combines technical expertise with a commitment to user experience.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href="https://github.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="GitHub Profile"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section className="py-16 border-t border-border bg-muted/30">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">
              Looking Ahead
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Chartify is continuously evolving. We're committed to improving the platform based on user feedback, adding new chart types, enhancing export capabilities, and building features that make data visualization even more intuitive. Stay tuned for updates as we grow.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
