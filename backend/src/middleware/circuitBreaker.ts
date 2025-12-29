/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures when external services are unavailable
 */

import { CircuitBreakerError } from '@/types/errors';
import logger from '../utils/logger';

interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  monitoringPeriod: number;
}

interface CircuitBreakerState {
  isOpen: boolean;
  failureCount: number;
  successCount: number;
  lastFailureTime: number | null;
  lastSuccessTime: number | null;
}

export class CircuitBreaker {
  private state: CircuitBreakerState;
  private config: CircuitBreakerConfig;
  private name: string;

  constructor(name: string, config: Partial<CircuitBreakerConfig> = {}) {
    this.name = name;
    this.config = {
      failureThreshold: config.failureThreshold || 5,
      successThreshold: config.successThreshold || 2,
      timeout: config.timeout || 60000, // 1 minute
      monitoringPeriod: config.monitoringPeriod || 300000 // 5 minutes
    };

    this.state = {
      isOpen: false,
      failureCount: 0,
      successCount: 0,
      lastFailureTime: null,
      lastSuccessTime: null
    };

    logger.info(`CircuitBreaker initialized: ${this.name}`, {
      config: this.config
    });
  }

  /**
   * Execute operation with circuit breaker protection
   */
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      if (this.shouldAttemptReset()) {
        logger.info(`Attempting to reset circuit: ${this.name}`);
        this.state.isOpen = false;
        this.state.successCount = 0;
      } else {
        throw new CircuitBreakerError(
          `Circuit breaker is open for ${this.name}`,
          { additionalData: { circuitBreaker: this.name } }
        );
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error as Error);
      throw error;
    }
  }

  /**
   * Check if circuit is open
   */
  private isOpen(): boolean {
    return this.state.isOpen;
  }

  /**
   * Check if we should attempt to reset the circuit
   */
  private shouldAttemptReset(): boolean {
    if (!this.state.lastFailureTime) {
      return false;
    }

    const timeSinceLastFailure = Date.now() - this.state.lastFailureTime;
    return timeSinceLastFailure > this.config.timeout;
  }

  /**
   * Handle successful operation
   */
  private onSuccess(): void {
    this.state.successCount++;
    this.state.failureCount = 0;
    this.state.lastSuccessTime = Date.now();

    logger.debug(`Operation succeeded: ${this.name}`, {
      successCount: this.state.successCount
    });

    if (this.state.successCount >= this.config.successThreshold) {
      this.state.isOpen = false;
      this.state.successCount = 0;
      logger.info(`Circuit breaker reset: ${this.name}`);
    }
  }

  /**
   * Handle failed operation
   */
  private onFailure(error: Error): void {
    this.state.failureCount++;
    this.state.lastFailureTime = Date.now();

    logger.warn(`Operation failed: ${this.name}`, {
      failureCount: this.state.failureCount,
      error: error.message
    });

    if (this.state.failureCount >= this.config.failureThreshold) {
      this.state.isOpen = true;
      logger.error(`Circuit breaker opened: ${this.name}`, {
        failureCount: this.state.failureCount,
        threshold: this.config.failureThreshold
      });
    }
  }

  /**
   * Get current state
   */
  getState(): CircuitBreakerState {
    return { ...this.state };
  }

  /**
   * Reset circuit breaker
   */
  reset(): void {
    this.state = {
      isOpen: false,
      failureCount: 0,
      successCount: 0,
      lastFailureTime: null,
      lastSuccessTime: null
    };
    logger.info(`Circuit breaker manually reset: ${this.name}`);
  }
}

/**
 * Circuit Breaker Registry
 * Manages multiple circuit breakers
 */
class CircuitBreakerRegistry {
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();

  /**
   * Get or create circuit breaker
   */
  get(name: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
    if (!this.circuitBreakers.has(name)) {
      this.circuitBreakers.set(name, new CircuitBreaker(name, config));
    }
    return this.circuitBreakers.get(name)!;
  }

  /**
   * Get all circuit breakers
   */
  getAll(): Map<string, CircuitBreakerState> {
    const states = new Map<string, CircuitBreakerState>();
    this.circuitBreakers.forEach((cb, name) => {
      states.set(name, cb.getState());
    });
    return states;
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    this.circuitBreakers.forEach((cb) => cb.reset());
    logger.info('All circuit breakers reset');
  }
}

export const circuitBreakerRegistry = new CircuitBreakerRegistry();