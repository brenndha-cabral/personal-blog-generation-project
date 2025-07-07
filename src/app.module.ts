import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { ThemeModule } from './theme/theme.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
// import { DevService } from './data/services/dev.service';
import { ProdService } from './data/services/prod.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      // useClass: DevService, // -> usar em desenvolvimento
      useClass: ProdService, //-> usar em produção
      imports: [ConfigModule],
    }),
    PostModule,
    ThemeModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
