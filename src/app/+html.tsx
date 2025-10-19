import { ScrollViewStyleReset } from "expo-router/html";
import { PropsWithChildren } from "react";

export default function Html({ children }: PropsWithChildren) {
  return (
    <html lang="en" style={{ backgroundColor: "#000000" }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />

        <title>Expo Router Blog - Modern React Native Blog</title>
        <meta
          name="description"
          content="A modern, performant blog built with Expo Router and Sanity CMS. Discover articles, authors, and insights."
        />

        {/* Open Graph tags for social sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Expo Router Blog" />
        <meta
          property="og:description"
          content="A modern, performant blog built with Expo Router and Sanity CMS"
        />
        <meta property="og:site_name" content="Expo Router Blog" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Expo Router Blog" />
        <meta
          name="twitter:description"
          content="A modern, performant blog built with Expo Router and Sanity CMS"
        />

        {/* Force dark theme */}
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#000000" />

        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/assets/node_modules/@expo-google-fonts/montserrat/500Medium/Montserrat_500Medium.9d496514aedf5c9bb3f689de8b094cd8.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/node_modules/@expo-google-fonts/montserrat/600SemiBold/Montserrat_600SemiBold.c1bd726715a688ead84c2dbf4c82f88d.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />

        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'Montserrat-Medium';
                font-style: normal;
                font-weight: 500;
                font-display: swap;
                src: local('Montserrat Medium'), local('Montserrat-Medium'),
                     url('/assets/node_modules/@expo-google-fonts/montserrat/500Medium/Montserrat_500Medium.9d496514aedf5c9bb3f689de8b094cd8.ttf') format('truetype');
              }
              @font-face {
                font-family: 'Montserrat-SemiBold';
                font-style: normal;
                font-weight: 600;
                font-display: swap;
                src: local('Montserrat SemiBold'), local('Montserrat-SemiBold'),
                     url('/assets/node_modules/@expo-google-fonts/montserrat/600SemiBold/Montserrat_600SemiBold.c1bd726715a688ead84c2dbf4c82f88d.ttf') format('truetype');
              }
              @font-face {
                font-family: 'Montserrat-Bold';
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: local('Montserrat Bold'), local('Montserrat-Bold');
              }
              @font-face {
                font-family: 'Montserrat-Light';
                font-style: normal;
                font-weight: 300;
                font-display: swap;
                src: local('Montserrat Light'), local('Montserrat-Light');
              }
              
              /* System font fallback with similar metrics to Montserrat */
              body {
                font-family: 'Montserrat-Medium', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              }
            `,
          }}
        />

        <ScrollViewStyleReset />
      </head>
      <body style={{ overflowY: "scroll" }}>{children}</body>
    </html>
  );
}
