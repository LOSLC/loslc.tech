export type PaginatedRequest<T> = {
  data: T;
  offset?: number;
  limit?: number;
};

export type ServerResponse<T> =
  | {
      success: true;
      message?: string;
      data: T extends void ? undefined : T;
    }
  | {
      success: false;
      message: string;
      data?: T;
    };
