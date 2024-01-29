import {
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Telegraf, session } from 'telegraf';
import { AppService } from './app.service';
import { actionButtons } from './app.buttons';
import { Context } from './context.interface';
import { showlist } from './app.utils';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hello 🐝');
    await ctx.reply('What I can do for you?🐝', actionButtons());
  }

  @Hears('🌻To do list')
  async taskList(ctx: Context) {
    const todos = await this.appService.getAll();
    await ctx.reply(showlist(todos));
  }

  @Hears('✅Task completed')
  async doneList(ctx: Context) {
    ctx.session.type = 'done';
    await ctx.deleteMessage();
    await ctx.reply(`Provide you task ID:`);
  }

  @Hears('✍️Task edit')
  async editList(ctx: Context) {
    ctx.session.type = 'edit';
    await ctx.deleteMessage();
    await ctx.replyWithHTML(
      `Provide you task ID and new name: \n\n` + `In format - 1 | New name`,
    );
  }

  @Hears('❌Delete the task')
  async deleteList(ctx: Context) {
    ctx.session.type = 'remove';
    await ctx.deleteMessage();
    await ctx.reply(`Provide you task ID:`);
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type == 'done') {
      const todos = await this.appService.doneTask(Number(message));

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Task with this ID doesnt exist');
        return;
      }
      await ctx.reply(showlist(todos));
    }
    if (ctx.session.type == 'edit') {
      const [taskId, taskName] = message.split(' | ');
      const todos = await this.appService.editTask(Number(taskId), taskName);

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Task with this ID doesnt exist');
        return;
      }
      await ctx.reply(showlist(todos));
    }
    if (ctx.session.type == 'remove') {
      const todos = await this.appService.deleteTask(Number(message));

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Task with this ID doesnt exist');
        return;
      }

      await ctx.reply(showlist(todos));
    }
  }
}
