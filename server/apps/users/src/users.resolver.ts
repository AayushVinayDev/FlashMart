import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { ActivationDto, ForgotPasswordDto, RegisterDto, ResetPasswordDto } from "./dto/users.dto";
import { ActivationResponse, ForgotPasswordResponse, LoginResponse, LogoutResponse, RegisterResponse, ResetPasswordResponse } from "./types/users.types";
import { BadRequestException, UseGuards} from "@nestjs/common";
import { User } from "./entities/users.entity";
import { Response } from "express";
import { AuthGuard } from "./guards/auth.guard";



@Resolver('User')
// @UserFilters
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService
    ){}

    @Mutation(() => RegisterResponse)
    async register(
      @Args('registerDto') registerDto: RegisterDto,
      @Context() context: { res: Response },
    ): Promise<RegisterResponse> {
      if (!registerDto.name || !registerDto.email || !registerDto.password) {
        throw new BadRequestException('Please fill the all fields');
      }
  
      const { activation_token } = await this.usersService.register(
        registerDto,
        context.res,
      );
  
      return { activation_token };
    }

    @Mutation(() => ActivationResponse)
    async activateUser(
        @Args('activationDto') activationDto: ActivationDto,
        @Context() context: { res: Response },
    ) : Promise<ActivationResponse> {
        return await this.usersService.activateUser(activationDto, context.res);
    }

    @Mutation(() => LoginResponse)
    async Login(
      @Args('email') email: string,
      @Args('password') password: string,
    ): Promise<LoginResponse> {
      return await this.usersService.Login({ email, password });
    }
  
    @Query(() => LoginResponse)
    @UseGuards(AuthGuard)
    async getLoggedInUser(@Context() context: { req: Request }) {
      return await this.usersService.getLoggedInUser(context.req);
    }

    @Mutation(() => ForgotPasswordResponse)
    async forgotPassword(
      @Args('forgotPasswordDto') forgotPasswordDto: ForgotPasswordDto,
    ): Promise<ForgotPasswordResponse> {
      return await this.usersService.forgotPassword(forgotPasswordDto);
    }
  
    @Mutation(() => ResetPasswordResponse)
    async resetPassword(
      @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
    ): Promise<ResetPasswordResponse> {
      return await this.usersService.resetPassword(resetPasswordDto);
    }

    @Query(() => LogoutResponse)
    @UseGuards(AuthGuard)
    async logOutUser(@Context() context: { req: Request }) {
      return await this.usersService.Logout(context.req);
    }
  

    @Query(() => [User])
    async getUsers() {
        return this.usersService.getUsers();
    }
}