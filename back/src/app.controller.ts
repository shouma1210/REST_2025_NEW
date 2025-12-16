import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Render,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    
    @Get("/") 
    @Render("index.njk")
    

    @Get("api/cards") 
    listCards() {
        return this.appService.listCards();
    }

    @Post("api/cards")
    createCard(@Body() body: any, @Query("count") count?: string) {
        const n = count ? Number(count) : 100;
        return this.appService.createCardWithInstances(body, n);
    }

    @Put("api/cards/:id")
    updateCard(@Param("id") id: string, @Body() body: any) {
        return this.appService.updateCard(Number(id), body);
    }

  
    @Delete("api/cards/:id")
    deleteCard(@Param("id") id: string) {
        return this.appService.deleteCard(Number(id));
    }

    @Get("api/cards/:id/instances")
    listInstances(@Param("id") id: string) {
        return this.appService.listInstances(Number(id));
    }

   
    @Post("api/cards/:id/instances")
    createInstance(@Param("id") id: string, @Body() body: any) {
        return this.appService.createInstance(Number(id), body);
    }

    
    @Put("api/instances/:instanceId")
    updateInstance(@Param("instanceId") instanceId: string, @Body() body: any) {
        return this.appService.updateInstance(Number(instanceId), body);
    }

    @Delete("api/instances/:instanceId")
    deleteInstance(@Param("instanceId") instanceId: string) {
        return this.appService.deleteInstance(Number(instanceId));
    }
}