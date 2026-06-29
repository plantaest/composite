export interface PageTextQueryResponse {
  query: {
    pages: Array<{
      revisions?: Array<{
        slots?: {
          main?: {
            content?: string;
          };
        };
      }>;
    }>;
  };
}
