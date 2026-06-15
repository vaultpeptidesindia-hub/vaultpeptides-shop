// Renders a JSON-LD <script> in the server-rendered HTML so crawlers and AI
// engines read it on first paint. Pass a schema object (or array of objects).

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Schema is build-time/server data, never user input — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
