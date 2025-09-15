// tiny sanity export
export const helloFromCore = () => "Hello from vis-core";

// example shared component
export function CoreButton({ children }: { children: React.ReactNode }) {
  return <button style={{ padding: 8, borderRadius: 6 }}>{children}</button>;
}