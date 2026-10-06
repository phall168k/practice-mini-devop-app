import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
    public healtCheck() {
        return {
            status: 'healthy',
            uptime: process.uptime(),
        };
    }
}
