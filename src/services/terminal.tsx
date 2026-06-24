import { terminalApi } from "./apis/terminalApi";

export interface Terminal {

    id: string;
    acc_token:string;
    serial_number:number;
    signature:string;
    issuer:string
    subject:string
    role:string
    timestamp:Date
    transactions: string[];

}

export const terminalService = {
  async createTerminal(): Promise<Terminal> {
    const response = await terminalApi.get<Terminal>('create-terminal')
    return response.data
  }
}