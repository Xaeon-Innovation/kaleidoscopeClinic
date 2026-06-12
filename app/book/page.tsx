import { BookAppointmentClient } from "@/components/BookAppointmentClient";
import { BookHeroSection } from "@/components/book/BookHeroSection";
import { SiteHeader } from "@/components/SiteHeader";
import { getBookableConsultations } from "@/lib/content/getContent";

export const metadata = {
  title: "Book a consultation",
  description:
    "Choose an appointment time and pay a consultation deposit online.",
};

export default async function BookPage() {
  const bookableConsultations = await getBookableConsultations();

  return (
    <div className="min-h-full">
      <SiteHeader />

      <BookHeroSection />

      <section
        id="book-calendar"
        className="scroll-mt-24 bg-white py-12 pb-[calc(var(--mobile-chrome-height)+3rem)] sm:py-16 sm:pb-16 lg:py-20"
      >
        <div className="page-section-inner max-w-3xl">
          <BookAppointmentClient
            bookableConsultations={bookableConsultations}
          />
        </div>
      </section>
    </div>
  );
}
