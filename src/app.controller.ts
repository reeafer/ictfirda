import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  async login(@Body() body: { username: string, password?: string }) {
    try {
      return await this.appService.login(body.username, body.password || '');
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  @Post('signup')
  async signup(@Body() body: { username: string, password?: string }) {
    try {
      return await this.appService.signup(body.username, body.password || '');
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('events')
  async getEvents() {
    return this.appService.getEvents();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('events')
  async createEvent(@Body() body: { title: string, optionA: string, optionB: string }) {
    return this.appService.createEvent(body.title, body.optionA, body.optionB);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('bet')
  async placeBet(@Request() req, @Body() body: { eventId: number, option: 'A' | 'B', amount: number }) {
    try {
      const username = req.user.username;
      return await this.appService.placeBet(body.eventId, body.option, body.amount, username);
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  // --- GAME ENDPOINTS ---
  @Get('games')
  async getGames() {
    return this.appService.getGames();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('games/slots/play')
  async playSlots(@Request() req, @Body() body: { gameId: number, betAmount: number }) {
    try {
      const userId = req.user.userId;
      return await this.appService.playSlots(userId, body.gameId, body.betAmount);
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('games/blackjack/play')
  async playBlackjack(@Request() req, @Body() body: { gameId: number, betAmount: number }) {
    try {
      const userId = req.user.userId;
      return await this.appService.playBlackjack(userId, body.gameId, body.betAmount);
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('games/roulette/play')
  async playRoulette(@Request() req, @Body() body: { gameId: number, betAmount: number, betType: string, betValue: any }) {
    try {
      const userId = req.user.userId;
      return await this.appService.playRoulette(userId, body.gameId, body.betAmount, body.betType, body.betValue);
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('stats')
  async getUserStats(@Request() req) {
    try {
      const userId = req.user.userId;
      return await this.appService.getUserStats(userId);
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
}
