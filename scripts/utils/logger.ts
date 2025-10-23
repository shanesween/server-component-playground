import { isDevelopment } from './env';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
    level: LogLevel;
    message: string;
    data?: any;
    timestamp?: boolean;
}

class Logger {
    private isDev = isDevelopment();

    private formatMessage(level: LogLevel, message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        const levelEmoji = this.getLevelEmoji(level);
        const levelStr = level.toUpperCase().padEnd(5);

        let formatted = `${levelEmoji} [${timestamp}] ${levelStr} ${message}`;

        if (data && this.isDev) {
            formatted += `\n${JSON.stringify(data, null, 2)}`;
        }

        return formatted;
    }

    private getLevelEmoji(level: LogLevel): string {
        switch (level) {
            case 'debug': return '🔍';
            case 'info': return 'ℹ️';
            case 'warn': return '⚠️';
            case 'error': return '❌';
            default: return '📝';
        }
    }

    private log(options: LogOptions): void {
        const { level, message, data, timestamp = true } = options;

        // In production, only log warnings and errors
        if (!this.isDev && (level === 'debug' || level === 'info')) {
            return;
        }

        const formattedMessage = this.formatMessage(level, message, data);

        switch (level) {
            case 'debug':
                console.debug(formattedMessage);
                break;
            case 'info':
                console.info(formattedMessage);
                break;
            case 'warn':
                console.warn(formattedMessage);
                break;
            case 'error':
                console.error(formattedMessage);
                break;
        }
    }

    debug(message: string, data?: any): void {
        this.log({ level: 'debug', message, data });
    }

    info(message: string, data?: any): void {
        this.log({ level: 'info', message, data });
    }

    warn(message: string, data?: any): void {
        this.log({ level: 'warn', message, data });
    }

    error(message: string, data?: any): void {
        this.log({ level: 'error', message, data });
    }

    success(message: string, data?: any): void {
        this.log({ level: 'info', message: `✅ ${message}`, data });
    }

    // Specialized logging for seeding operations
    seedStart(sport: string): void {
        this.info(`🏈 Starting ${sport.toUpperCase()} teams seed...`);
    }

    seedComplete(sport: string, count: number): void {
        this.success(`Successfully seeded ${count} ${sport.toUpperCase()} teams`);
    }

    seedSkipped(sport: string, reason: string): void {
        this.warn(`${sport.toUpperCase()} teams seed skipped: ${reason}`);
    }

    seedError(sport: string, error: any): void {
        this.error(`${sport.toUpperCase()} teams seed failed:`, error);
    }
}

// Export singleton instance
export const logger = new Logger();

// Export types
export type { LogLevel, LogOptions };
