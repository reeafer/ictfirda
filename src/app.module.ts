import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { BettingEvent } from './betting-event.entity';
import { Game } from './game.entity';
import { GameSession } from './game-session.entity';
import { Transaction } from './transaction.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'postgres',
      entities: [User, BettingEvent, Game, GameSession, Transaction],
      synchronize: true, // Auto-create tables (DEV ONLY)
    }),
    TypeOrmModule.forFeature([
      User,
      BettingEvent,
      Game,
      GameSession,
      Transaction,
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY_123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
