import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Optional: Makes PrismaService globally available across the application
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export the service so it can be used in other modules
})
export class PrismaModule {}
