import { ApolloClientProvider } from "@/shared/lib";
import { ThemeProvider } from "@/shared/theme";
import { TooltipProvider } from "@/shared/ui";
import { Footer, Navbar } from "@/shared/ui/system/landing";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ApolloClientProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Navbar />
          {children}
          <Footer />
        </TooltipProvider>
      </ThemeProvider>
    </ApolloClientProvider>
  );
}
