import { Optional } from "@nestjs/common"
import { IsBoolean, IsString, Min, MinLength } from "class-validator"

export class CreateCustomerDto {

    @IsString()
    @Optional()
    customer_id?:string

    @IsString()
    cust_name:string

    @IsString()
    email:string

    @IsString()
    @MinLength(4)
    password:string

    @IsBoolean()
    @Optional()
    isAdmin?:boolean

}
