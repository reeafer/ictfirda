import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { BettingEvent } from './betting-event.entity';
import { Game } from './game.entity';
import { GameSession } from './game-session.entity';
import { Transaction } from './transaction.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(BettingEvent)
    private eventsRepository: Repository<BettingEvent>,
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    @InjectRepository(GameSession)
    private gameSessionsRepository: Repository<GameSession>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private jwtService: JwtService,
  ) { }

  getHello(): string {
    return 'FirdaBet API is running!';
  }

  // --- USERS ---
  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async signup(username: string, passwordPlain: string): Promise<any> {
    const existing = await this.usersRepository.findOneBy({ username });
    if (existing) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(passwordPlain, 10);

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      isAdmin: username.toLowerCase() === 'admin',
      balance: username.toLowerCase() === 'admin' ? 100000 : 1000
    });

    const savedUser = await this.usersRepository.save(user);
    const payload = { username: savedUser.username, sub: savedUser.id };

    return {
      user: savedUser,
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(username: string, passwordPlain: string): Promise<any> {
    const user = await this.usersRepository.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();

    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(passwordPlain, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    // Remove password from object before returning
    delete user.password;

    const payload = { username: user.username, sub: user.id };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  // --- EVENTS ---
  async createEvent(title: string, optionA: string, optionB: string): Promise<BettingEvent> {
    const event = this.eventsRepository.create({ title, optionA, optionB });
    return this.eventsRepository.save(event);
  }

  async getEvents(): Promise<BettingEvent[]> {
    return this.eventsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async placeBet(eventId: number, option: 'A' | 'B', amount: number, username: string) {
    const event = await this.eventsRepository.findOneBy({ id: eventId });
    const user = await this.usersRepository.findOneBy({ username });

    if (!event) throw new Error('Event not found');
    if (!user) throw new Error('User not found');
    if (user.balance < amount) throw new Error('Insufficient funds');

    // Update balances
    user.balance -= amount;
    await this.usersRepository.save(user);

    // Update pools
    if (option === 'A') event.poolA += amount;
    else event.poolB += amount;

    await this.eventsRepository.save(event);

    return { success: true, newBalance: user.balance, event };
  }

  // --- GAMES ---
  async getGames(): Promise<Game[]> {
    return this.gamesRepository.find();
  }

  async getGame(id: number): Promise<Game> {
    return this.gamesRepository.findOneBy({ id });
  }

  // --- SLOTS GAME ---
  async playSlots(userId: number, gameId: number, betAmount: number): Promise<any> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    const game = await this.gamesRepository.findOneBy({ id: gameId });

    if (!user) throw new Error('User not found');
    if (!game) throw new Error('Game not found');
    if (user.balance < betAmount) throw new Error('Insufficient funds');
    if (betAmount < game.min_bet || betAmount > game.max_bet) {
      throw new Error(`Bet must be between ${game.min_bet} and ${game.max_bet}`);
    }

    // Deduct bet
    user.balance -= betAmount;
    await this.usersRepository.save(user);

    // Create transaction
    await this.transactionsRepository.save({
      user_id: userId,
      amount: -betAmount,
      type: 'BET',
      description: `Bet on ${game.name}`
    });

    // Generate slot result (3 reels, symbols 0-9)
    const reels = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10)
    ];

    let winMultiplier = 0;
    let result = 'LOSS';

    // Check for wins
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      // Three of a kind
      if (reels[0] === 7) {
        winMultiplier = 100; // Jackpot!
      } else {
        winMultiplier = 10;
      }
      result = 'WIN';
    } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
      // Two of a kind
      winMultiplier = 2;
      result = 'WIN';
    }

    const winAmount = betAmount * winMultiplier;

    if (winAmount > 0) {
      user.balance += winAmount;
      await this.usersRepository.save(user);

      await this.transactionsRepository.save({
        user_id: userId,
        amount: winAmount,
        type: 'WIN',
        description: `Won on ${game.name}`
      });
    }

    // Save game session
    const session = await this.gameSessionsRepository.save({
      user_id: userId,
      game_id: gameId,
      bet_amount: betAmount,
      win_amount: winAmount,
      game_data: { reels, winMultiplier },
      result
    });

    return {
      session,
      reels,
      winAmount,
      winMultiplier,
      result,
      newBalance: user.balance
    };
  }

  // --- BLACKJACK GAME ---
  async playBlackjack(userId: number, gameId: number, betAmount: number): Promise<any> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    const game = await this.gamesRepository.findOneBy({ id: gameId });

    if (!user) throw new Error('User not found');
    if (!game) throw new Error('Game not found');
    if (user.balance < betAmount) throw new Error('Insufficient funds');

    // Deduct bet
    user.balance -= betAmount;
    await this.usersRepository.save(user);

    await this.transactionsRepository.save({
      user_id: userId,
      amount: -betAmount,
      type: 'BET',
      description: `Bet on ${game.name}`
    });

    // Simple blackjack simulation
    const drawCard = () => Math.min(Math.floor(Math.random() * 13) + 1, 10);

    const playerCards = [drawCard(), drawCard()];
    const dealerCards = [drawCard(), drawCard()];

    let playerTotal = playerCards.reduce((a, b) => a + b, 0);
    let dealerTotal = dealerCards.reduce((a, b) => a + b, 0);

    // Simple AI: dealer hits until 17
    while (dealerTotal < 17) {
      const card = drawCard();
      dealerCards.push(card);
      dealerTotal += card;
    }

    let result = 'LOSS';
    let winAmount = 0;

    if (playerTotal === 21) {
      result = 'WIN';
      winAmount = betAmount * 2.5; // Blackjack pays 3:2
    } else if (playerTotal > 21) {
      result = 'LOSS';
    } else if (dealerTotal > 21) {
      result = 'WIN';
      winAmount = betAmount * 2;
    } else if (playerTotal > dealerTotal) {
      result = 'WIN';
      winAmount = betAmount * 2;
    } else if (playerTotal === dealerTotal) {
      result = 'PUSH';
      winAmount = betAmount; // Return bet
    }

    if (winAmount > 0) {
      user.balance += winAmount;
      await this.usersRepository.save(user);

      await this.transactionsRepository.save({
        user_id: userId,
        amount: winAmount,
        type: result === 'PUSH' ? 'BET' : 'WIN',
        description: `${result} on ${game.name}`
      });
    }

    const session = await this.gameSessionsRepository.save({
      user_id: userId,
      game_id: gameId,
      bet_amount: betAmount,
      win_amount: winAmount,
      game_data: { playerCards, dealerCards, playerTotal, dealerTotal },
      result
    });

    return {
      session,
      playerCards,
      dealerCards,
      playerTotal,
      dealerTotal,
      winAmount,
      result,
      newBalance: user.balance
    };
  }

  // --- ROULETTE GAME ---
  async playRoulette(userId: number, gameId: number, betAmount: number, betType: string, betValue: any): Promise<any> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    const game = await this.gamesRepository.findOneBy({ id: gameId });

    if (!user) throw new Error('User not found');
    if (!game) throw new Error('Game not found');
    if (user.balance < betAmount) throw new Error('Insufficient funds');

    user.balance -= betAmount;
    await this.usersRepository.save(user);

    await this.transactionsRepository.save({
      user_id: userId,
      amount: -betAmount,
      type: 'BET',
      description: `Bet on ${game.name}`
    });

    // Spin the wheel (0-36)
    const spinResult = Math.floor(Math.random() * 37);
    const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(spinResult);
    const isBlack = spinResult !== 0 && !isRed;

    let winMultiplier = 0;
    let result = 'LOSS';

    // Check bet type
    switch (betType) {
      case 'number':
        if (spinResult === betValue) {
          winMultiplier = 35;
          result = 'WIN';
        }
        break;
      case 'red':
        if (isRed) {
          winMultiplier = 1;
          result = 'WIN';
        }
        break;
      case 'black':
        if (isBlack) {
          winMultiplier = 1;
          result = 'WIN';
        }
        break;
      case 'even':
        if (spinResult !== 0 && spinResult % 2 === 0) {
          winMultiplier = 1;
          result = 'WIN';
        }
        break;
      case 'odd':
        if (spinResult !== 0 && spinResult % 2 === 1) {
          winMultiplier = 1;
          result = 'WIN';
        }
        break;
    }

    const winAmount = betAmount * (winMultiplier + 1);

    if (winAmount > 0) {
      user.balance += winAmount;
      await this.usersRepository.save(user);

      await this.transactionsRepository.save({
        user_id: userId,
        amount: winAmount,
        type: 'WIN',
        description: `Won on ${game.name}`
      });
    }

    const session = await this.gameSessionsRepository.save({
      user_id: userId,
      game_id: gameId,
      bet_amount: betAmount,
      win_amount: winAmount,
      game_data: { spinResult, betType, betValue, isRed, isBlack },
      result
    });

    return {
      session,
      spinResult,
      isRed,
      isBlack,
      winAmount,
      result,
      newBalance: user.balance
    };
  }

  // --- USER STATS ---
  async getUserStats(userId: number): Promise<any> {
    const sessions = await this.gameSessionsRepository.find({
      where: { user_id: userId },
      order: { played_at: 'DESC' },
      take: 10
    });

    const totalBets = await this.gameSessionsRepository
      .createQueryBuilder('session')
      .select('SUM(session.bet_amount)', 'total')
      .where('session.user_id = :userId', { userId })
      .getRawOne();

    const totalWins = await this.gameSessionsRepository
      .createQueryBuilder('session')
      .select('SUM(session.win_amount)', 'total')
      .where('session.user_id = :userId', { userId })
      .getRawOne();

    return {
      recentSessions: sessions,
      totalBets: parseFloat(totalBets.total) || 0,
      totalWins: parseFloat(totalWins.total) || 0,
      profit: (parseFloat(totalWins.total) || 0) - (parseFloat(totalBets.total) || 0)
    };
  }
}
