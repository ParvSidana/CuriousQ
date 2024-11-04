"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

const Home = () => {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Unlock Insights with Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            {/* TODO :  */}
            CuriousQ - Where your identity remains a secret.
          </p>
        </section>
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-auto max-w-xs md:max-w-xs"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex text-center text-2xl items-center justify-center pb-0">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col aspect-square items-center justify-center pt-0 ">
                    <p className="text-lg font-semibold">{message.content}</p>
                    <p className="pt-7 pl-40 text-xs text-muted-foreground">
                      {message.received}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="w-full p-4 rounded-lg shadow-md text-left items-start">
          <Accordion type="multiple">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                What is the purpose of this app?
              </AccordionTrigger>
              <AccordionContent>
                This app allows users to provide anonymous feedback and receive
                valuable insights to improve their experiences.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How does anonymity work?</AccordionTrigger>
              <AccordionContent>
                Users can submit feedback without revealing their identity,
                ensuring honest and open communication.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is my data safe?</AccordionTrigger>
              <AccordionContent>
                Yes, we prioritize user privacy and employ industry-standard
                security measures to protect your data.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                Can I edit my feedback after submitting it?
              </AccordionTrigger>
              <AccordionContent>
                Currently, submitted feedback cannot be edited. However, you can
                submit new feedback at any time.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © {new Date().getFullYear()} CuriousQ. All rights reserved.
      </footer>
    </>
  );
};

export default Home;
