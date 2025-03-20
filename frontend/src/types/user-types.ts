export interface User {
    id: string;
    name: string;
    role: "PROVIDERAWAIT";
    email: string;
  }
  
  export interface ActionResponse {
    success: boolean;
    message?: string;
  }