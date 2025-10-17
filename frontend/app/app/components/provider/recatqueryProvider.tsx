import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./authcontext";

export const queryClient = new QueryClient();

const ReactQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </>
  );
};
export default ReactQueryClientProvider;
