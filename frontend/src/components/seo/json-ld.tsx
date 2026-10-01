export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escaping "<" prevents a value from closing the script tag (XSS).
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
