import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString,  } from "class-validator"

export class CreateOrderDto {

    @IsString()
    name:string 
    
    @IsString()
    event_type:string

    @IsDateString()
    event_date:string
   
    @IsString()
    level: string

    @IsString()
    venue:string

    @IsNumberString()
    contact:string

    @IsNumberString()
    @IsOptional()
    alternative_contact?:string

    @IsString()
    @IsEmail()
    mail_id:string

    @IsString()
    @IsNotEmpty()
    customer_id :string

    
  
}
