import { Injectable } from '@nestjs/common';
import { HealthService as CoreHealthService } from '@new-hros/libs-core';

@Injectable()
export class HealthService extends CoreHealthService {}
