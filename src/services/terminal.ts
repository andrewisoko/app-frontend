import { terminalApi } from "./apis/terminalApi";

export const terminal:Terminal[] = []

export interface Terminal {

    id: string;
    acc_token:string;
    serial_number:number;
    signature:string;
    issuer:string
    subject:string
    role:string
    timestamp:Date 

}
export const terminalService = {

  async createTerminal(): Promise<Terminal> {
    
    console.log('terminal',terminal)

    if( terminal.length > 0){
      console.log(terminal[0])
        return terminal[0]
    }else{
        const response =
          await terminalApi.get<Terminal>(
            "create-terminal"
          );
    
        console.log("API RESPONSE", response);
        terminal.push(response.data)
          
        return response.data;
      }
    }
};